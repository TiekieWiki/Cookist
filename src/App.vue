<template>
  <router-link to="/">{{ $t('homePage.title') }}</router-link>

  <router-view />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
