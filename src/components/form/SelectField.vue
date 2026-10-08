<template>
  <label :id="id">
    {{ required ? label + ' *' : label }}
    <div class="select" :class="variant" :required="required">
      <select
        v-model="selected"
        :aria-label="ariaLabel"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="error ? errorId : undefined"
        :disabled="disabled"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="item in items" :value="item.value" :key="item.value">
          {{ labelPrefix ? $t(labelPrefix + item.label) : item.label }}
        </option>
      </select>
    </div>
    <FieldError :id="errorId" :message="error" />
  </label>
</template>

<script setup lang="ts">
import { ColorVariant } from '@/utils/types/enums';
import { type SelectFieldProps } from '@/utils/types/form';
import { useId } from 'vue';
import FieldError from './FieldError.vue';

withDefaults(defineProps<SelectFieldProps>(), {
  variant: ColorVariant.SECONDARY,
  required: false,
  disabled: false
});

const selected = defineModel<string>('selected');

const errorId = useId();
</script>
