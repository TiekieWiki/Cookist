<template>
  <teleport to="body" v-if="openPopUp">
    <div class="overlay"></div>
    <main>
      <article class="card">
        <section class="header">
          <h2>{{ $t(title) }}</h2>
          <Button
            @click="openPopUp = false"
            :type="ButtonType.BUTTON"
            :variant="ColorVariant.SECONDARY"
          >
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </Button>
        </section>
        <section>
          <p>{{ $t(section) }}</p>
        </section>
        <section class="footer">
          <Button
            @click="openPopUp = false"
            :type="ButtonType.BUTTON"
            :variant="ColorVariant.SECONDARY"
          >
            {{ $t(cancel) }}
          </Button>
          <Button
            @click.prevent="emit('confirm', true)"
            :type="ButtonType.SUBMIT"
            :variant="ColorVariant.ERROR"
          >
            {{ $t(confirm) }}
          </Button>
        </section>
      </article>
    </main>
  </teleport>
</template>

<script setup lang="ts">
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import Button from './Button.vue';
import { ConfirmPopUpProps } from '@/utils/types/form';

defineProps<ConfirmPopUpProps>();

const emit = defineEmits<{ confirm: [boolean] }>();
const openPopUp = defineModel<boolean>('openPopUp');
</script>
