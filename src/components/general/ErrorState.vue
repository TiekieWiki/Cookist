<template>
  <div class="card" role="alert">
    <div class="emptyState">
      <Pill :variant="ColorVariant.PRIMARY" :size="Size.XLARGE">
        <font-awesome-icon :icon="['fas', isConnectionProblem ? 'wifi' : 'triangle-exclamation']" />
      </Pill>
      <div>
        <h3>{{ $t(`general.errors.actions.${error.action}`) }}</h3>
        <p>{{ $t(`general.errors.causes.${error.code}`) }}</p>
      </div>
      <Button
        @click="emit('retry')"
        :type="ButtonType.BUTTON"
        :variant="ColorVariant.PRIMARY"
        :size="Size.LARGE"
      >
        <font-awesome-icon :icon="['fas', 'rotate-right']" />{{ $t('general.actions.tryAgain') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Pill from './Pill.vue';
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import { type ActionError } from '@/utils/global/errorHandling';

const props = defineProps<{ error: ActionError }>();
const emit = defineEmits<{ retry: [] }>();

const isConnectionProblem = computed<boolean>(() =>
  ['offline', 'network'].includes(props.error.code)
);
</script>
