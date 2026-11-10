<template>
  <label :for="id">
    {{ required ? label + ' *' : label }}
    <input
      :id="id"
      :name="name"
      :class="variant"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      :type="type"
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :min="min"
      :max="max"
      :step="step"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="error ? errorId : undefined"
      v-model="input"
      @input="updateWhileComposing"
    />
    <FieldError :id="errorId" :message="error" />
  </label>
</template>

<script setup lang="ts">
import { AutoCompleteVariant, ColorVariant } from '@/utils/types/enums';
import { type InputFieldProps } from '@/utils/types/form';
import { useId } from 'vue';
import FieldError from './FieldError.vue';

withDefaults(defineProps<InputFieldProps>(), {
  variant: ColorVariant.SECONDARY,
  required: false,
  disabled: false,
  autocomplete: AutoCompleteVariant.OFF
});

const input = defineModel<string | number | null | undefined>('input');

const errorId = useId();

/**
 * Update the value while a mobile keyboard is still composing a word. v-model waits until the word
 * is finished, so on mobile the value would only change after a space or a chosen suggestion.
 * @param event Input event of the field
 */
function updateWhileComposing(event: Event): void {
  if ((event as InputEvent).isComposing) {
    input.value = (event.target as HTMLInputElement).value;
  }
}
</script>
