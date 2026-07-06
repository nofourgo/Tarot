<template>
  <video :src="src" autoplay loop muted playsinline aria-hidden="true" :class="`fixed bottom-0 right-0 z-[9999] select-none ${width} ${clickThrough ? 'pointer-events-none' : ''}`" />
</template>
<script setup lang="ts">
// Chuyển thể từ KhaBanhVideo.tsx (React): video meme nổi ở góc phải dưới,
// xuyên click (pointer-events-none) để không cản thao tác với web
withDefaults(
  defineProps<{
    src?: string
    width?: string
    clickThrough?: boolean
  }>(),
  {
    src: '/khabanh-alpha.webm',
    width: 'w-48 md:w-64',
    clickThrough: true,
  },
)
</script>
