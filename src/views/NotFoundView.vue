<template>
  <main class="notFound">
    <article>
      <EmptyState
        icon="link-slash"
        title="notFoundPage.title"
        subtitle="notFoundPage.description"
        button-text="homePage.title"
        button-route="/"
      />
    </article>
  </main>
</template>

<script setup lang="ts">
import EmptyState from '@/components/general/EmptyState.vue';
</script>
