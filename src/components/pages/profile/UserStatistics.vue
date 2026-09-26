<template>
  <div v-if="userStatistics" class="statistics">
    <section class="card">
      <font-awesome-icon :icon="['fas', 'book']" />
      <h2>{{ userStatistics?.recipesCreated }}</h2>
      <p class="small">{{ $t('profilePage.statistics.recipesCreated') }}</p>
    </section>
    <section class="card">
      <font-awesome-icon :icon="['fas', 'star']" />
      <h2>{{ userStatistics?.averageRating }}</h2>
      <p class="small">{{ $t('profilePage.statistics.averageRating') }}</p>
    </section>
    <section class="card">
      <font-awesome-icon :icon="['fas', 'calendar']" />
      <h2>{{ userStatistics?.neverCooked }}</h2>
      <p class="small">{{ $t('profilePage.statistics.neverCooked') }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getUserStatistics } from '@/utils/profile/userStatistics';
import type { UserStatistics } from '@/utils/types/profile';
import { onMounted, ref } from 'vue';

const userStatistics = ref<UserStatistics | null>(null);

onMounted(async () => {
  userStatistics.value = await getUserStatistics();
});
</script>
