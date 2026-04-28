<template>
  <main>
    <article class="row">
      <LoginCard />
      <RegisterCard />
    </article>
  </main>
</template>

<script setup lang="ts">
import LoginCard from '@/components/login/LoginCard.vue';
import RegisterCard from '@/components/login/RegisterCard.vue';
</script>
