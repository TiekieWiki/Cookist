<template>
  <div
    :id="id"
    class="radiobutton-list-group"
    role="radiogroup"
    :aria-labelledby="label ? labelId : undefined"
  >
    <span v-if="label" :id="labelId" class="list-label">
      {{ required ? label + ' *' : label }}
    </span>

    <div class="radiobutton-list">
      <TransitionGroup name="list">
        <div
          v-for="(item, index) in items"
          :key="item.id ?? item.name"
          class="radiobutton-list-item"
        >
          <RadioButton
            :id="item.id"
            :variant="item.variant"
            :name="groupName"
            :value="item.name"
            :label="item.label"
            :required="item.required"
            :disabled="item.disabled"
            :autocomplete="item.autocomplete"
            v-model:selected="selected"
          />

          <slot name="item" :item="item" :index="index" />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RadioButtonListProps } from '@/utils/types/form';
import RadioButton from './RadioButton.vue';
import { computed, useId } from 'vue';

const props = defineProps<RadioButtonListProps>();

const selected = defineModel<string | null>('selected');

const labelId = useId();

const groupName = computed<string>(() => props.name ?? props.id ?? labelId!);
</script>
