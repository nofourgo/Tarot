<template>
  <div class="Onboarding">
    <div class="frame">
      <Transition name="scene" mode="out-in">
        <!-- Scene 1: Hỏi tên -->
        <div class="scene" v-if="currentScene === 1" :key="1">
          <div class="symbol"><img :src="iconMoon" alt="" /></div>
          <h2>Trước khi những lá bài lên tiếng...</h2>
          <p class="ask sparkle delay">Ta nên gọi bạn là gì?</p>
          <div class="input-wrap delay2">
            <input v-model="userInfo.name" type="text" placeholder="Nhập tên hoặc biệt danh của bạn" @keyup.enter="next" />
          </div>
          <p class="hint delay2">Nếu bạn giữ im lặng, ta sẽ gọi bạn là<br /><em>Người mang thiên mệnh.</em></p>
          <div class="actions">
            <Button variant="outline" class="next-btn mystic-btn emblem" :style="btnBgStyle" @click="next">Tiếp tục&ensp;→</Button>
          </div>
        </div>

        <!-- Scene 2: Giới tính -->
        <div class="scene" v-else-if="currentScene === 2" :key="2">
          <div class="symbol"><img :src="iconFullmoon" alt="" /></div>
          <h2>
            <span class="line1">{{ displayName }},</span>
            <span class="line2">bạn muốn được nhìn nhận như thế nào?</span>
          </h2>
          <div class="divider">─── ✦ ───</div>
          <div class="genders">
            <button type="button" :class="{ active: userInfo.gender === g.label }" v-for="g in genderOptions" :key="g.label" @click="userInfo.gender = g.label">
              <span class="g-icon">{{ g.icon }}</span>
              <span class="g-label">{{ g.label }}</span>
            </button>
          </div>
          <p class="hint sparkle">Bạn có thể bỏ qua nếu không muốn chia sẻ.</p>
          <div class="actions">
            <Button variant="outline" class="nav-btn mystic-btn emblem" :style="backBgStyle" @click="back">←&ensp;Quay lại</Button>
            <Button variant="outline" class="next-btn mystic-btn emblem" :style="btnBgStyle" @click="next">Tiếp tục&ensp;→</Button>
          </div>
        </div>

        <!-- Scene 3: Ngày tháng năm sinh -->
        <div class="scene" v-else-if="currentScene === 3" :key="3">
          <div class="symbol"><img :src="iconSun" alt="" /></div>
          <h2>Ngày bạn đến với thế giới này...</h2>
          <p class="ask">Ngày sinh có thể giúp trải bài được cá nhân hóa sâu hơn.</p>
          <div class="birth">
            <div class="b-field">
              <span class="b-label">Ngày</span>
              <div class="select-wrap">
                <select v-model="userInfo.birthDay">
                  <option value="">--</option>
                  <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
            </div>
            <div class="b-field">
              <span class="b-label">Tháng</span>
              <div class="select-wrap">
                <select v-model="userInfo.birthMonth">
                  <option value="">--</option>
                  <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>
            </div>
            <div class="b-field">
              <span class="b-label">Năm</span>
              <div class="select-wrap">
                <select v-model="userInfo.birthYear">
                  <option value="">----</option>
                  <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>
            </div>
          </div>
          <p class="warn" v-if="birthWarn">{{ birthWarn }}</p>
          <p class="hint sparkle" v-else>Bạn có thể bỏ qua nếu không muốn chia sẻ.</p>
          <div class="actions">
            <Button variant="outline" class="nav-btn mystic-btn emblem" :style="backBgStyle" @click="back">←&ensp;Quay lại</Button>
            <Button variant="outline" class="next-btn mystic-btn emblem" :style="btnBgStyle" @click="next">Tiếp tục&ensp;→</Button>
          </div>
        </div>

        <!-- Scene 4: Chọn chủ đề (bắt buộc) -->
        <div class="scene wide" v-else-if="currentScene === 4" :key="4">
          <div class="symbol"><img :src="iconStar" alt="" /></div>
          <h2>Điều gì đang khiến bạn trăn trở?</h2>
          <p class="ask">Hãy chọn một chủ đề mà bạn muốn những lá bài soi sáng.</p>
          <div class="topics">
            <div class="topic" :class="{ active: selectedTopic === c.id }" v-for="c in questionCategories" :key="c.id" @click="selectedTopic = c.id">
              <span class="icon">{{ iconOf(c.label) }}</span>
              <span class="label">{{ textOf(c.label) }}</span>
            </div>
          </div>
          <p class="hint" v-if="!selectedTopic">Vui lòng chọn một chủ đề để tiếp tục.</p>
          <div class="actions">
            <Button variant="outline" class="nav-btn mystic-btn emblem" :style="backBgStyle" @click="back">←&ensp;Quay lại</Button>
            <Button variant="outline" class="next-btn mystic-btn emblem" :style="btnBgStyle" :disabled="!selectedTopic" @click="next">Tiếp tục&ensp;→</Button>
          </div>
        </div>

        <!-- Scene 5: Câu hỏi chi tiết (không bắt buộc) -->
        <div class="scene wide" v-else :key="5">
          <div class="symbol"><img :src="iconStar2" alt="" /></div>
          <h2>
            <span class="line1">{{ displayName }},</span>
            <span class="line2">trong <em class="topic-hl">{{ selectedTopicInfo?.phrase }}</em>, điều gì bạn thực sự muốn biết?</span>
          </h2>
          <div class="textarea-wrap">
            <Textarea class="mt-5 h-32 rounded-lg border-[#8f6fd8]/40 bg-[#120a2a]/50 px-4 py-3 focus-visible:ring-[#a879ff]/50" v-model="detailedQuestion" :placeholder="selectedTopicInfo?.placeholder" />
          </div>
          <p class="hint sparkle">Bạn có thể giữ câu hỏi trong lòng và tiếp tục nếu chưa muốn chia sẻ.</p>
          <div class="actions">
            <Button variant="outline" class="nav-btn mystic-btn emblem" :style="backBgStyle" @click="back">←&ensp;Quay lại</Button>
            <Button variant="outline" class="next-btn cta mystic-btn emblem" :style="btnBgStyle" @click="next">Để những lá bài lên tiếng&ensp;✦</Button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { userInfo, displayName, questionCategories, selectedTopic, selectedTopicInfo, detailedQuestion } from '@/lib/userInfo'
import iconMoon from '@/assets/icons/moon.webp'
import iconFullmoon from '@/assets/icons/fullmoon.webp'
import iconSun from '@/assets/icons/sun.webp'
import iconStar from '@/assets/icons/star.webp'
import iconStar2 from '@/assets/icons/star-2.webp'
import btnMoon from '@/assets/button-bg/1.webp'
import btnSun from '@/assets/button-bg/2.webp'
import btnStar from '@/assets/button-bg/3.webp'
import btnStar2 from '@/assets/button-bg/4.webp'
import btnFullmoon from '@/assets/button-bg/5.webp'

// startAt: cho phép quay lại giữa hành trình (vd Scene 4 khi muốn đổi chủ đề sau khi bói xong)
const props = withDefaults(defineProps<{ startAt?: number }>(), { startAt: 1 })
const emit = defineEmits<{ (e: 'done'): void }>()

// Lựa chọn giới tính kèm biểu tượng trang trí
const genderOptions = [
  { label: 'Nam', icon: '♂' },
  { label: 'Nữ', icon: '♀' },
  { label: 'Khác', icon: '⚧' },
  { label: 'Không muốn chia sẻ', icon: '✶' },
]

// Nhãn chủ đề hiện có dạng "💕 Tình yêu" — tách icon và chữ để trình bày, không tạo data mới
const iconOf = (label: string) => label.split(' ')[0]
const textOf = (label: string) => label.split(' ').slice(1).join(' ')

// Dữ liệu cho 3 dropdown ngày sinh
const days = Array.from({ length: 31 }, (_, i) => String(i + 1))
const months = Array.from({ length: 12 }, (_, i) => String(i + 1))
const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => String(currentYear - i))

// Dropdown đã chặn giá trị ngoài khoảng, chỉ cần kiểm tra ngày không tồn tại (vd 30/2)
const birthWarn = ref('')
const validateBirth = (): boolean => {
  birthWarn.value = ''
  const { birthDay: d, birthMonth: m, birthYear: y } = userInfo
  if (d && m && y) {
    const day = Number(d)
    const month = Number(m)
    const year = Number(y)
    const date = new Date(year, month - 1, day)
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      birthWarn.value = 'Ngày này không tồn tại trên lịch, hãy kiểm tra lại.'
    }
  }
  return !birthWarn.value
}

// Điều hướng giữa các scene
const currentScene = ref(Math.min(Math.max(props.startAt, 1), 5))

// Nền plaque của nút "Tiếp tục" đổi theo biểu tượng từng scene
const sceneBtnBgs: Record<number, string> = { 1: btnMoon, 2: btnFullmoon, 3: btnSun, 4: btnStar, 5: btnStar2 }
const btnBgStyle = computed(() => ({ '--btn-bg': `url(${sceneBtnBgs[currentScene.value]})` }))
// Nút "Quay lại" mang nền của scene trước đó — gợi nơi người dùng sẽ trở về
const backBgStyle = computed(() => ({ '--btn-bg': `url(${sceneBtnBgs[Math.max(currentScene.value - 1, 1)]})` }))
const next = () => {
  if (currentScene.value === 3 && !validateBirth()) return
  if (currentScene.value === 4 && !selectedTopic.value) return
  birthWarn.value = ''
  if (currentScene.value < 5) currentScene.value++
  else emit('done')
}
const back = () => {
  birthWarn.value = ''
  if (currentScene.value > 1) currentScene.value--
}
</script>

<style scoped lang="less">
.Onboarding {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  overflow-y: auto;
  padding: 4.6rem 1rem 2rem;
  background: rgba(2, 4, 12, 0.52);

  // Khung viền vàng mảnh bao quanh toàn bộ hành trình
  & > .frame {
    box-sizing: border-box;
    margin: auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 42rem;
    min-height: 30rem;
    padding: 1.5rem 1.4rem 2rem;
    border: 1px solid rgba(212, 178, 106, 0.25);
    border-radius: 6px;

    & > .scene {
      position: relative;
      box-sizing: border-box;
      margin: auto;
      width: 100%;
      max-width: 30rem;
      padding-top: 1.2rem;
      text-align: center;

      &.wide {
        max-width: 34rem;
      }

      // Quầng sáng tím/xanh navy rất nhẹ phía sau nội dung
      &::before {
        content: '';
        position: absolute;
        inset: -3rem -2rem;
        z-index: -1;
        background: radial-gradient(ellipse at center, rgba(109, 74, 189, 0.22), rgba(36, 48, 110, 0.1) 55%, transparent 78%);
        filter: blur(20px);
        pointer-events: none;
      }

      & > .symbol {
        display: flex;
        justify-content: center;

        & > img {
          width: 6.5rem;
          filter: drop-shadow(0 0 16px rgba(212, 178, 106, 0.45));
          user-select: none;
          -webkit-user-drag: none;
        }
      }

      & > h2 {
        margin: 0.7rem 0 0;
        font-family: 'Arizonia', 'HarmonyOS Sans SC Medium', cursive;
        font-size: 2.3rem;
        font-weight: normal;
        line-height: 1.3;
        color: #e8c987;
        text-shadow: 0 0 20px rgba(212, 178, 106, 0.25);

        & > .line1 {
          display: block;
          font-size: 2.6rem;
        }

        & > .line2 {
          display: block;
          margin-top: 0.2rem;
          font-family: 'HarmonyOS Sans SC Medium', sans-serif;
          font-size: 1.02rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.88);

          & > .topic-hl {
            font-style: normal;
            color: #e58ad0;
          }
        }
      }

      & > .divider {
        margin-top: 0.6rem;
        font-size: 0.6rem;
        letter-spacing: 0.2em;
        color: rgba(212, 178, 106, 0.45);
      }

      & > .ask {
        margin: 0.8rem 0 0;
        font-size: 0.94rem;
        color: rgba(255, 255, 255, 0.78);
      }

      .sparkle {
        &::before {
          content: '✦ ';
          color: rgba(226, 192, 120, 0.6);
        }

        &::after {
          content: ' ✦';
          color: rgba(226, 192, 120, 0.6);
        }
      }

      & > .hint {
        margin: 1rem 0 0;
        font-size: 0.76rem;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.45);

        & > em {
          font-style: normal;
          font-size: 0.86rem;
          color: #e2c078;
        }
      }

      & > .warn {
        margin: 1rem 0 0;
        font-size: 0.76rem;
        color: rgba(230, 150, 120, 0.9);
      }

      // Ô nhập tên: khung tím mờ, ánh sao bên phải
      & > .input-wrap {
        position: relative;
        box-sizing: border-box;
        margin: 1.3rem auto 0;
        width: 100%;
        max-width: 24rem;

        &::after {
          content: '✦';
          position: absolute;
          right: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(226, 192, 120, 0.55);
          pointer-events: none;
        }

        & > input {
          box-sizing: border-box;
          width: 100%;
          padding: 0.72rem 2.3rem 0.72rem 1rem;
          font-size: 0.92rem;
          font-family: inherit;
          color: inherit;
          background: rgba(18, 12, 38, 0.55);
          border: 1px solid rgba(150, 110, 220, 0.35);
          border-radius: 8px;
          outline: none;
          transition:
            border-color 0.3s,
            box-shadow 0.3s;

          &::placeholder {
            color: rgba(255, 255, 255, 0.32);
          }

          &:focus {
            border-color: rgba(168, 121, 255, 0.7);
            box-shadow: 0 0 12px rgba(140, 90, 255, 0.3);
          }
        }
      }

      // Thẻ giới tính: biểu tượng hồng + nhãn, chọn thì viền tím phát sáng
      & > .genders {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.7rem;
        margin-top: 1.4rem;

        & > button {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 0.45rem;
          width: 6.6rem;
          min-height: 6.2rem;
          padding: 0.8rem 0.4rem;
          font-family: inherit;
          background: rgba(18, 12, 38, 0.55);
          border: 1px solid rgba(150, 110, 220, 0.28);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.28s;

          & > .g-icon {
            font-size: 1.5rem;
            color: #e58ad0;
          }

          & > .g-label {
            font-size: 0.78rem;
            line-height: 1.35;
            color: rgba(255, 255, 255, 0.85);
          }

          &:hover {
            border-color: rgba(168, 121, 255, 0.55);
          }

          &.active {
            border-color: #a879ff;
            background: rgba(140, 90, 255, 0.14);
            box-shadow: 0 0 14px rgba(140, 90, 255, 0.4);
          }
        }
      }

      // Ngày sinh: 3 dropdown với nhãn vàng phía trên
      & > .birth {
        display: flex;
        justify-content: center;
        gap: 0.9rem;
        margin-top: 1.4rem;

        & > .b-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;

          & > .b-label {
            font-size: 0.78rem;
            color: rgba(226, 192, 120, 0.8);
          }

          & > .select-wrap {
            position: relative;

            &::after {
              content: '▾';
              position: absolute;
              right: 0.7rem;
              top: 50%;
              transform: translateY(-50%);
              font-size: 0.7rem;
              color: rgba(255, 255, 255, 0.5);
              pointer-events: none;
            }

            & > select {
              box-sizing: border-box;
              width: 6rem;
              padding: 0.55rem 1.8rem 0.55rem 0.9rem;
              font-size: 0.9rem;
              font-family: inherit;
              color: rgba(255, 255, 255, 0.9);
              background: rgba(18, 12, 38, 0.55);
              border: 1px solid rgba(150, 110, 220, 0.35);
              border-radius: 8px;
              outline: none;
              appearance: none;
              -webkit-appearance: none;
              cursor: pointer;
              transition:
                border-color 0.3s,
                box-shadow 0.3s;

              &:focus {
                border-color: rgba(168, 121, 255, 0.7);
                box-shadow: 0 0 12px rgba(140, 90, 255, 0.3);
              }
            }
          }
        }
      }

      // Lưới chủ đề: chọn thì viền tím phát sáng như bản mẫu
      & > .topics {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.7rem;
        margin-top: 1.4rem;

        & > .topic {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          padding: 1.05rem 0.5rem;
          border: 1px solid rgba(150, 110, 220, 0.28);
          border-radius: 12px;
          background: rgba(18, 12, 38, 0.55);
          cursor: pointer;
          transition: all 0.28s;
          user-select: none;

          & > .icon {
            font-size: 1.45rem;
          }

          & > .label {
            font-size: 0.82rem;
            color: rgba(255, 255, 255, 0.85);
          }

          &:hover {
            border-color: rgba(168, 121, 255, 0.55);
            transform: translateY(-2px);
          }

          &.active {
            border-color: #a879ff;
            background: rgba(140, 90, 255, 0.14);
            box-shadow: 0 0 16px rgba(140, 90, 255, 0.4);

            & > .label {
              color: #f0e6ff;
            }
          }
        }
      }

      & > .textarea-wrap {
        position: relative;

        &::after {
          content: '✦˖';
          position: absolute;
          right: 0.9rem;
          bottom: 0.6rem;
          font-size: 0.8rem;
          color: rgba(226, 192, 120, 0.5);
          pointer-events: none;
        }
      }

      & > .actions {
        display: flex;
        // Màn hẹp: nút dài (CTA scene 5) tự xuống hàng riêng thay vì bị bóp chữ tràn khỏi plaque
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.9rem;
        margin-top: 1.8rem;
      }
    }
  }
}

// Nền/viền/glow đã do plaque mystic-btn (main.less) đảm nhận, chỉ giữ bề rộng tối thiểu
.next-btn {
  min-width: 8.5rem;
}

// Chuyển scene: cũ mờ dần trượt lên kèm blur nhẹ, mới hiện từ dưới lên với scale 0.98 → 1
.scene-enter-active {
  transition:
    opacity 0.6s ease,
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.6s ease;
}

.scene-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease,
    filter 0.4s ease;
}

.scene-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.scene-leave-to {
  opacity: 0;
  transform: translateY(-14px);
  filter: blur(3px);
}

// Scene 1: câu hỏi và ô nhập hiện ra sau tiêu đề một nhịp
.delay {
  animation: riseIn 0.6s ease 0.35s both;
}

.delay2 {
  animation: riseIn 0.6s ease 0.6s both;
}

@keyframes riseIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media screen and (max-width: 588px) {
  .Onboarding {
    & > .frame {
      padding: 1.2rem 0.9rem 1.6rem;

      & > .scene {
        & > h2 {
          font-size: 1.9rem;

          & > .line1 {
            font-size: 2.1rem;
          }
        }

        & > .topics {
          grid-template-columns: repeat(2, 1fr);
        }

        & > .genders > button {
          width: calc(50% - 0.4rem);
        }
      }
    }
  }
}
</style>
