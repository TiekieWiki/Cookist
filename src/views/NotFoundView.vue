<template>
  <main class="notFound">
    <article>
      <EmptyState
        icon="link-slash"
        title="general.pageTitles.notFound"
        subtitle="notFoundPage.description"
        button-text="general.pageTitles.home"
        button-route="/"
      />
    </article>
  </main>
</template>

<script setup lang="ts">
import EmptyState from '@/components/general/EmptyState.vue';
</script>
