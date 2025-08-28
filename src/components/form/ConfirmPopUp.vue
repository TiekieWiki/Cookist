<template>
  <teleport to="body" v-if="openPopUp">
    <main class="modal">
      <article>
        <section class="header">
          <h2>{{ $t(title) }}</h2>
          <h2>
            <font-awesome-icon @click="openPopUp = false" :icon="['fas', 'xmark']" />
          </h2>
        </section>
        <section class="content">
          <p>{{ $t(section) }}</p>
        </section>
        <section class="footer">
          <button @click="openPopUp = false" type="button">
            {{ $t(cancel) }}
          </button>
          <button @click.prevent="emit('confirm', true)" class="delete" type="submit">
            {{ $t(confirm) }}
          </button>
        </section>
      </article>
    </main>
  </teleport>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  section: string;
  cancel: string;
  confirm: string;
}>();

const emit = defineEmits<{ confirm: [boolean] }>();
const openPopUp = defineModel<boolean>('openPopUp');
</script>
