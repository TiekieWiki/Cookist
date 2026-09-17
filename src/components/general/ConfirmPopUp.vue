<template>
  <teleport to="body">
    <Transition name="fade">
      <div v-if="openPopUp" class="overlay"></div>
    </Transition>
    <Transition name="pop">
      <article v-if="openPopUp" class="confirmPopUp">
        <div class="title">
          <h2>{{ $t(title) }}</h2>
          <Button
            @click="openPopUp = false"
            :type="ButtonType.BUTTON"
            :variant="ColorVariant.TERTIARY"
          >
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </Button>
        </div>
        <p>{{ $t(section) }}</p>
        <div class="footer">
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
            :variant="ColorVariant.WARNING"
          >
            {{ $t(confirm) }}
          </Button>
        </div>
      </article>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import Button from '../form/Button.vue';
import { type ConfirmPopUpProps } from '@/utils/types/general';

defineProps<ConfirmPopUpProps>();

const emit = defineEmits<{ confirm: [boolean] }>();
const openPopUp = defineModel<boolean>('openPopUp');
</script>
