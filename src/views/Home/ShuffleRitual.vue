<template>
  <div class="ShuffleRitual">
    <div class="frame">
      <div class="scene">
        <p class="summary">{{ selectedTopicInfo?.label }} · {{ displayName }}</p>
        <div class="symbol"><img :src="iconHandstar" alt="" /></div>

        <Transition name="fade-text" mode="out-in">
          <div class="texts" :key="status">
            <h2>{{ texts[status].title }}</h2>
            <p class="ask">{{ texts[status].sub }}</p>
            <p class="ask small" v-if="status === 'idle'">Khi đã sẵn sàng, hãy chạm vào bộ bài để bắt đầu xáo.</p>
          </div>
        </Transition>

        <p class="question" v-if="status === 'idle' && detailedQuestion.trim()">“{{ detailedQuestion.trim() }}”</p>

        <!-- Bộ bài nhiều lớp: tái sử dụng ảnh mặt sau hiện có -->
        <div class="deck-float" :class="status">
          <div class="deck" :class="status" @click="startShuffle">
            <div class="layer" :style="layerStyle(i)" v-for="i in LAYERS" :key="i"></div>
          </div>
        </div>

        <p class="hint sparkle" v-if="status === 'idle'">Chạm vào bộ bài để xáo</p>
        <p class="pulse-star" v-else-if="status === 'shuffling'">✦</p>
        <div class="actions" v-else>
          <Button variant="outline" class="cta-btn mystic-btn" :style="ctaBgStyle" @click="emit('done')">Chọn 3 lá bài&ensp;✦</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, type CSSProperties } from 'vue'
import { Button } from '@/components/ui/button'
import { displayName, selectedTopicInfo, detailedQuestion } from '@/lib/userInfo'
import iconHandstar from '@/assets/icons/handstar.webp'
import btnHands from '@/assets/button-bg/6.webp'

// Nền plaque đôi tay cho nút CTA (đối xứng nên không cần lệch chữ)
const ctaBgStyle = { '--btn-bg': `url(${btnHands})` }

const emit = defineEmits<{ (e: 'shuffled'): void; (e: 'done'): void }>()

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Nội dung theo từng trạng thái nghi thức
const texts = {
  idle: { title: 'Hãy tĩnh tâm...', sub: 'Hãy tập trung vào câu hỏi của bạn' },
  shuffling: { title: 'Đang xáo bài...', sub: 'Hãy giữ câu hỏi trong tâm trí' },
  completed: { title: 'Những lá bài đã sẵn sàng', sub: 'Đã đến lúc để trực giác dẫn lối.' },
} as const

// idle → chạm bộ bài → shuffling → animation kết thúc → completed → CTA chọn bài
const status = ref<'idle' | 'shuffling' | 'completed'>('idle')

// 7 lớp bài xếp chồng, mỗi lớp lệch nhẹ và xoay một góc nhỏ tạo chiều sâu
const LAYERS = 7
const SHUFFLE_MS = 2400
const LAYER_DELAY = 70
const layerStyle = (i: number): CSSProperties => {
  const c = i - Math.ceil(LAYERS / 2)
  return {
    '--ox': `${c * 2.6}px`,
    '--oy': `${Math.abs(c) * -1.2}px`,
    '--rot': `${c * 1.5}deg`,
    // Hướng tách trái/phải xen kẽ khi xáo
    '--sx': String(c === 0 ? 1 : Math.sign(c)),
    '--d': `${(i - 1) * LAYER_DELAY}ms`,
    '--z': String(i),
    '--zx': String(LAYERS + 1 - i),
  }
}

const startShuffle = async () => {
  if (status.value !== 'idle') return
  status.value = 'shuffling'
  // Đợi toàn bộ các lớp chạy xong animation (kể cả lớp trễ nhất)
  await sleep(SHUFFLE_MS + LAYERS * LAYER_DELAY)
  emit('shuffled')
  status.value = 'completed'
}
</script>

<style scoped lang="less">
.ShuffleRitual {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  overflow-y: auto;
  padding: 4.6rem 1rem 2rem;
  background: rgba(2, 4, 12, 0.52);

  // Khung viền vàng mảnh đồng bộ với 5 scene onboarding
  & > .frame {
    box-sizing: border-box;
    margin: auto;
    display: flex;
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
      text-align: center;

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

      & > .summary {
        margin: 0 0 0.9rem;
        font-size: 0.78rem;
        letter-spacing: 0.04em;
        color: rgba(226, 192, 120, 0.8);
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

      .texts {
        & > h2 {
          margin: 0.7rem 0 0;
          font-family: 'Arizonia', 'HarmonyOS Sans SC Medium', cursive;
          font-size: 2.3rem;
          font-weight: normal;
          line-height: 1.3;
          color: #e8c987;
          text-shadow: 0 0 20px rgba(212, 178, 106, 0.25);
        }

        & > .ask {
          margin: 0.7rem 0 0;
          font-size: 0.94rem;
          color: rgba(255, 255, 255, 0.78);

          &.small {
            margin-top: 0.35rem;
            font-size: 0.78rem;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }

      // Câu hỏi chi tiết người dùng đã nhập: một dòng, cắt bớt nếu quá dài
      & > .question {
        margin: 0.8rem auto 0;
        max-width: 88%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 0.8rem;
        color: rgba(229, 138, 208, 0.85);
      }

      // Lớp nổi lên xuống nhẹ khi chờ (tách khỏi hover scale để không đè transform)
      & > .deck-float {
        width: max-content;
        margin: 1.7rem auto 0;

        &.idle {
          animation: deckFloat 3.6s ease-in-out infinite;
        }

        & > .deck {
          position: relative;
          width: 9.5rem;
          aspect-ratio: 6 / 10.06;
          cursor: pointer;
          transition:
            transform 0.3s,
            filter 0.3s;
          filter: drop-shadow(0 6px 18px rgba(120, 80, 220, 0.3));
          animation: deckGlowPulse 3.6s ease-in-out infinite;

          &.idle:hover {
            transform: translateY(-4px) scale(1.03);
            filter: drop-shadow(0 10px 26px rgba(150, 100, 255, 0.5));
            animation-play-state: paused;
          }

          &.shuffling {
            pointer-events: none;
            cursor: default;
            animation: none;
          }

          &.completed {
            pointer-events: none;
            cursor: default;
            animation: readyGlow 1.1s ease both;
          }

          & > .layer {
            position: absolute;
            inset: 0;
            z-index: var(--z);
            background: url('@/assets/images/card/bg.jpg') no-repeat center / cover;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
            transform: translate(var(--ox), var(--oy)) rotate(var(--rot));
          }

          // Xáo: tách trái/phải → đan xen đổi lớp → gom về giữa
          &.shuffling > .layer {
            animation: shufLayer 2.4s cubic-bezier(0.45, 0, 0.25, 1) var(--d) both;
          }
        }
      }

      & > .hint {
        margin: 1.2rem 0 0;
        font-size: 0.78rem;
        color: rgba(255, 255, 255, 0.5);

        &.sparkle {
          &::before {
            content: '✦ ';
            color: rgba(226, 192, 120, 0.6);
          }

          &::after {
            content: ' ✦';
            color: rgba(226, 192, 120, 0.6);
          }
        }
      }

      // Đốm sáng thở chậm trong lúc xáo
      & > .pulse-star {
        margin: 1.2rem 0 0;
        font-size: 0.9rem;
        color: rgba(226, 192, 120, 0.7);
        animation: pulseStar 1.6s ease-in-out infinite;
      }

      & > .actions {
        margin-top: 1.3rem;
        animation: riseIn 0.6s ease 0.35s both;
      }
    }
  }
}

// Nền/viền/glow đã do plaque mystic-btn (main.less) đảm nhận, chỉ giữ bề rộng tối thiểu
.cta-btn {
  min-width: 10rem;
}

// Nội dung chữ đổi trạng thái mềm mại
.fade-text-enter-active,
.fade-text-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.fade-text-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-text-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes deckFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

@keyframes deckGlowPulse {
  0%,
  100% {
    filter: drop-shadow(0 6px 18px rgba(120, 80, 220, 0.28));
  }
  50% {
    filter: drop-shadow(0 6px 24px rgba(140, 95, 240, 0.45));
  }
}

@keyframes shufLayer {
  0% {
    transform: translate(var(--ox), var(--oy)) rotate(var(--rot));
    z-index: var(--z);
  }
  22% {
    transform: translate(calc(var(--sx) * 84px), -10px) rotate(calc(var(--sx) * 11deg));
    z-index: var(--z);
  }
  48% {
    transform: translate(calc(var(--sx) * -58px), 7px) rotate(calc(var(--sx) * -8deg));
    z-index: var(--zx);
  }
  72% {
    transform: translate(calc(var(--sx) * 22px), -4px) rotate(calc(var(--sx) * 3deg));
    z-index: var(--zx);
  }
  100% {
    transform: translate(var(--ox), var(--oy)) rotate(var(--rot));
    z-index: var(--z);
  }
}

@keyframes readyGlow {
  0% {
    filter: drop-shadow(0 6px 18px rgba(120, 80, 220, 0.3));
  }
  40% {
    filter: drop-shadow(0 0 28px rgba(212, 178, 106, 0.65));
  }
  100% {
    filter: drop-shadow(0 8px 22px rgba(212, 178, 106, 0.35));
  }
}

@keyframes pulseStar {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(1);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.25);
  }
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
  .ShuffleRitual {
    & > .frame {
      padding: 1.2rem 0.9rem 1.6rem;

      & > .scene {
        .texts > h2 {
          font-size: 1.9rem;
        }

        & > .deck-float > .deck {
          width: 7.6rem;
        }
      }
    }
  }
}
</style>
