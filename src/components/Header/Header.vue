<template>
  <header class="fixed top-0 left-0 box-border px-[16.66px] flex justify-center w-screen h-max backdrop-blur-md bg-slate-950/25 border-b border-white/10 z-50">
    <div class="flex justify-between items-center w-full max-w-[888px] h-14">
      <a class="logo w-max h-full flex items-center gap-3" href="/">
        <img class="box-border w-auto h-full py-1 object-contain drop-shadow-[0_0_10px_rgba(212,178,106,0.35)]" src="@/assets/images/logo.webp" alt="Xích Anh" />
        <span class="text-lg font-bold">{{ props.title }}</span>
      </a>
      <h3 class="w-max h-max text-sm text-foreground/60 hidden sm:block">{{ props.desc }}</h3>
    </div>
  </header>
</template>
<script setup lang="ts">
const props = defineProps(['title', 'desc'])
</script>
