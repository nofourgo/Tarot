<template>
  <Header title="Bói Bài Tarot" desc="Chỉ mang tính giải trí" />
  <main><RouterView /></main>
  <Footer />
  <!-- Video meme Khá Bảnh: ẩn/hiện bằng nút tròn góc trái dưới -->
  <Transition name="kb-fade">
    <KhaBanhVideo v-if="showKhaBanh" />
  </Transition>
  <button
    type="button"
    class="kb-toggle"
    :class="{ active: showKhaBanh }"
    :style="{ backgroundImage: `url(${banhBg})` }"
    :title="showKhaBanh ? 'Ẩn Khá Bảnh' : 'Hiện Khá Bảnh'"
    :aria-pressed="showKhaBanh"
    @click="showKhaBanh = !showKhaBanh"
  ></button>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
import KhaBanhVideo from '@/components/KhaBanhVideo/KhaBanhVideo.vue'
import banhBg from '@/assets/button-bg/banh.png'

const showKhaBanh = ref(false)
</script>

<style scoped lang="less">
// Nút tròn nổi điều khiển video: nền banh.png, viền vàng đồng bộ chủ đề
.kb-toggle {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 10000;
  width: 3.5rem;
  height: 3.5rem;
  padding: 0;
  border: 2px solid rgba(212, 178, 106, 0.55);
  border-radius: 50%;
  // Ảnh dạng đứng, khuôn mặt ở khoảng 1/4 phía trên
  background: #000 no-repeat center 18% / 170%;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.55);
  transition:
    transform 0.25s,
    box-shadow 0.25s,
    border-color 0.25s;

  &:hover {
    transform: scale(1.08);
    border-color: rgba(226, 192, 120, 0.9);
    box-shadow: 0 4px 18px rgba(212, 178, 106, 0.45);
  }

  &.active {
    border-color: #e2c078;
    box-shadow: 0 0 16px rgba(212, 178, 106, 0.6);
  }
}

.kb-fade-enter-active,
.kb-fade-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.kb-fade-enter-from,
.kb-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
