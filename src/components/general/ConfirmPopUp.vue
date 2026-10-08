<template>
  <teleport to="body">
    <Transition name="fade">
      <div v-if="openPopUp" class="overlay"></div>
    </Transition>
    <Transition name="pop">
      <article
        v-if="openPopUp"
        ref="popUp"
        class="confirmPopUp card"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="`${id}-title`"
        :aria-describedby="`${id}-section`"
      >
        <div class="title">
          <h2 :id="`${id}-title`">{{ $t(title) }}</h2>
          <Button
            @click="openPopUp = false"
            :aria-label="$t('general.ariaLabel.close')"
            :type="ButtonType.BUTTON"
            :variant="ColorVariant.TERTIARY"
          >
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </Button>
        </div>
        <p :id="`${id}-section`">{{ $t(section) }}</p>
        <ErrorMessage :error="error" />
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
            :disabled="loading"
            :aria-busy="loading"
          >
            {{ $t(confirm) }}
          </Button>
        </div>
      </article>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import { useId, useTemplateRef } from 'vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import Button from '../form/Button.vue';
import ErrorMessage from '../form/ErrorMessage.vue';
import { type ConfirmPopUpProps } from '@/utils/types/general';
import { useFocusTrap } from '@/composables/useFocusTrap';

defineProps<ConfirmPopUpProps>();

const emit = defineEmits<{ confirm: [boolean] }>();
const openPopUp = defineModel<boolean>('openPopUp');

const id = useId();
const popUp = useTemplateRef<HTMLElement>('popUp');

useFocusTrap(popUp, openPopUp);
</script>
