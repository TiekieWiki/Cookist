<template>
  <main class="profile">
    <article>
      <UserCard />
      <UserStatistics />
      <PreferencesCard />
      <DeleteAccountButton />
    </article>
  </main>
</template>

<script setup lang="ts">
import UserCard from '@/components/pages/profile/UserCard.vue';
import PreferencesCard from '@/components/pages/profile/PreferencesCard.vue';
import DeleteAccountButton from '@/components/pages/profile/DeleteAccountButton.vue';
import UserStatistics from '@/components/pages/profile/UserStatistics.vue';
</script>
