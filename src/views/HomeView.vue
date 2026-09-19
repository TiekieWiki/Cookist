<template>
  <main class="home">
    <MainBanner />
    <ForgottenRecipes />
    <ActionPoints />
  </main>
</template>

<script setup lang="ts">
import MainBanner from '@/components/home/MainBanner.vue';
import ForgottenRecipes from '@/components/home/ForgottenRecipes.vue';
import ActionPoints from '@/components/home/ActionPoints.vue';
</script>
