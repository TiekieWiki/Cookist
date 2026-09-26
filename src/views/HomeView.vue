<template>
  <main class="home">
    <MainBanner />
    <ForgottenRecipes />
    <ActionPoints />
  </main>
</template>

<script setup lang="ts">
import MainBanner from '@/components/pages/home/MainBanner.vue';
import ForgottenRecipes from '@/components/pages/home/ForgottenRecipes.vue';
import ActionPoints from '@/components/pages/home/ActionPoints.vue';
</script>
