<template>
  <section class="Home">
    <!-- Scene 1-5: hành trình onboarding -->
    <Transition name="gate" appear>
      <Onboarding v-if="!onboardingCompleted" :start-at="onboardingStartAt" @done="onboardingCompleted = true" />
    </Transition>
    <!-- Scene 6: nghi thức xáo bài -->
    <Transition name="gate">
      <ShuffleRitual v-if="onboardingCompleted && !ritualDone" @shuffled="onShuffled" @done="ritualDone = true" />
    </Transition>
    <!-- Chọn 3 lá bài + xem kết quả -->
    <Transition name="reveal">
    <div class="panel" v-if="onboardingCompleted && ritualDone">
      <div class="summary" v-if="selectedTopicInfo">{{ selectedTopicInfo.label }} · {{ displayName }}</div>
      <template v-if="!loadingStatus">
        <h3 class="text nb pick">
          <span>Chọn 3 lá bài (bắt buộc)</span>
          <span class="count" :class="{ full: selectCardArr.length === 3 }">Đã chọn {{ selectCardArr.length }}/3 lá</span>
        </h3>
        <div class="card-list" :class="{ active: selectCardArr.length }">
          <div class="card" :class="{ active: selectCardArr.includes(n) }" :style="fanStyle(idx)" v-for="(n, idx) in randomCard" :key="idx" @click="selectCard(n)"></div>
        </div>
        <div class="btn">
          <Button class="mystic-btn mx-auto mt-4 flex w-full max-w-[20rem] min-h-[3rem]" :style="btnBg(btnHands)" :disabled="!canStart" @click="getRes">Bắt đầu bói</Button>
        </div>
      </template>
      <div class="card-jx" v-else>
      <div class="show-card">
        <div class="flip-card" :class="{ flipped: flippedCards[idx] }" v-for="(i, idx) in selectCardArr" :key="i.no">
          <div class="flip-inner">
            <div class="face back"></div>
            <div class="face front"><img :class="{ rever: i.isReversed }" :src="renderIMG(`${i.no}.jpg`)" /></div>
          </div>
        </div>
      </div>
      <p class="loading-tip" v-if="!resStatus">Đang luận giải</p>
      <Alert class="mt-4" v-if="resStatus">
        <AlertTitle>Luận giải bài Tarot:</AlertTitle>
        <AlertDescription><p class="[&>p]:indent-8 [&>p]:pt-2" ref="typedText"></p></AlertDescription>
      </Alert>
      <div class="mt-4 flex flex-wrap justify-end gap-3">
        <Button v-if="resStatus" class="mystic-btn emblem" :style="btnBg(btnStar)" @click="changeTopicFn">Đổi chủ đề & câu hỏi</Button>
        <Button class="mystic-btn emblem" :style="btnBg(btnMoon)" @click="resetFn">Bắt đầu lại</Button>
      </div>
      </div>
    </div>
    </Transition>
  </section>
</template>
<script setup lang="ts">
import { ref, computed, nextTick, type CSSProperties } from 'vue'
import vh from 'vh-plugin'
import { marked } from 'marked'
import Typed from 'typed.js'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Onboarding from './Onboarding.vue'
import ShuffleRitual from './ShuffleRitual.vue'
import { onboardingCompleted, selectedTopic, selectedTopicInfo, finalQuestion, displayName, detailedQuestion, userInfo } from '@/lib/userInfo'
import btnMoon from '@/assets/button-bg/1.webp'
import btnStar from '@/assets/button-bg/3.webp'
import btnHands from '@/assets/button-bg/6.webp'

// Nền plaque cho nút qua biến CSS --btn-bg (dùng cùng class mystic-btn trong main.less)
const btnBg = (img: string) => ({ '--btn-bg': `url(${img})` })

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Thuật toán xáo bài Fisher-Yates
const shuffleArray = (arr: number[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

// Xòe quạt: lá giữa nhô cao, hai mép thấp dần kèm xoay nhẹ (chỉ áp dụng ở layout 1 hàng)
const fanStyle = (idx: number): CSSProperties => {
  const c = idx - 10.5
  return { '--rot': `${c * 1.1}deg`, '--drop': `${c * c * 0.16}px` }
}

// Bộ bài 22 lá Ẩn Chính
const randomCard = ref<number[]>(Array.from({ length: 22 }, (_, i) => i))

// Scene 6 (nghi thức xáo bài) đã hoàn tất chưa
const ritualDone = ref(false)
// Animation xáo trong nghi thức kết thúc → xáo thứ tự thật của bộ bài
const onShuffled = () => shuffleArray(randomCard.value)

// Chọn lá bài
const selectCardArr = ref<Array<any>>([])
const selectCard = (id: number) => {
  if (selectCardArr.value.includes(id)) {
    selectCardArr.value = selectCardArr.value.filter((i) => i !== id)
    return
  }
  if (selectCardArr.value.length > 2) return
  selectCardArr.value.push(id)
}

// Lấy kết quả luận giải
const loadingStatus = ref<boolean>(false)
const resStatus = ref<boolean>(false)
// Đủ điều kiện bói: đã chọn chủ đề (từ onboarding) + đủ 3 lá
const canStart = computed(() => selectCardArr.value.length === 3 && !!selectedTopic.value && !!finalQuestion.value)
const flippedCards = ref<boolean[]>([])
const getRes = async () => {
  loadingStatus.value = true
  selectCardArr.value = selectCardArr.value.map((i) => ({ no: i, isReversed: Math.random() > 0.5 }))
  flippedCards.value = selectCardArr.value.map(() => false)
  // Lật từng lá lần lượt trong lúc chờ AI luận giải
  const flipPromise = (async () => {
    for (let idx = 0; idx < selectCardArr.value.length; idx++) {
      await sleep(600)
      flippedCards.value[idx] = true
    }
    await sleep(800) // Đợi lá cuối lật xong
  })()
  try {
    const res = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify({
        text: finalQuestion.value,
        pms: selectCardArr.value,
        userInfo: {
          name: userInfo.name,
          gender: userInfo.gender,
          birthDay: userInfo.birthDay,
          birthMonth: userInfo.birthMonth,
          birthYear: userInfo.birthYear
        },
        topic: selectedTopic.value,
        detailedQuestion: detailedQuestion.value
      })
    })
    const resText = await res.text()
    if (!res.ok) throw new Error(resText || `Lỗi ${res.status}`)
    await flipPromise
    resStatus.value = true
    renderRES(resText)
  } catch (e) {
    console.error(e)
    vh.Toast('Luận giải thất bại, vui lòng thử lại sau')
    // Khôi phục trạng thái để người dùng có thể thử lại
    selectCardArr.value = selectCardArr.value.map((i) => i.no)
    loadingStatus.value = false
  }
}

// Nội dung HTML sau khi render
const typedText = ref<HTMLParagraphElement>()
const renderRES = async (md: string) => {
  const renderedMarkdown = await marked.parse(md)
  await nextTick() // Đợi khối Alert render xong rồi mới gõ chữ
  new Typed(typedText.value, { strings: [renderedMarkdown], typeSpeed: 16, showCursor: false })
}

// Đặt lại: quay về nghi thức xáo bài (giữ nguyên dữ liệu onboarding)
const resetFn = async () => {
  vh.showLoading()
  await new Promise((resolve) => setTimeout(resolve, 666))
  selectCardArr.value = []
  resStatus.value = false
  loadingStatus.value = false
  flippedCards.value = []
  ritualDone.value = false
  vh.hideLoading()
}

// Onboarding bắt đầu từ scene nào (mặc định 1; đổi chủ đề thì vào thẳng Scene 4)
const onboardingStartAt = ref(1)

// Đổi chủ đề & câu hỏi: quay về Scene 4, xóa câu hỏi chi tiết cũ để nhập lại (giữ tên/giới tính/ngày sinh)
const changeTopicFn = async () => {
  vh.showLoading()
  await new Promise((resolve) => setTimeout(resolve, 666))
  selectCardArr.value = []
  resStatus.value = false
  loadingStatus.value = false
  flippedCards.value = []
  ritualDone.value = false
  detailedQuestion.value = ''
  onboardingStartAt.value = 4
  onboardingCompleted.value = false
  vh.hideLoading()
}

// Render động hình ảnh lá bài
const renderIMG = (url: string) => new URL(`../../assets/images/card/${url}`, import.meta.url).href
</script>

<style scoped lang="less">
@import 'Home.less';
</style>
