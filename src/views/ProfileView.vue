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
import UserCard from '@/components/profile/UserCard.vue';
import PreferencesCard from '@/components/profile/PreferencesCard.vue';
import DeleteAccountButton from '@/components/profile/DeleteAccountButton.vue';
import UserStatistics from '@/components/profile/UserStatistics.vue';
</script>
