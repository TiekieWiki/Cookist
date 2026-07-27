<template>
  <section class="card">
    <div class="header">
      <h3>{{ $t('recipePage.instructions') }}</h3>
      <div class="actions align">
        {{ $t('recipePage.keepOnScreen') }}
        <Toggle @click="keepScreenOn = !keepScreenOn" />
      </div>
    </div>
    <CheckBoxList v-model:items="instructions" />
    <Button
      @click="recipeStore.setLastEaten"
      :disabled="lastEatenToday"
      :type="ButtonType.BUTTON"
      :variant="ColorVariant.SECONDARY"
    >
      <font-awesome-icon v-if="lastEatenToday" :icon="['fas', 'check']" />
      <font-awesome-icon v-else :icon="['fas', 'calendar']" />
      {{ $t('recipePage.eatenToday') }}
    </Button>
  </section>
</template>

<script setup lang="ts">
import { useKeepScreenOn } from '@/composables/useKeepScreenOn';
import Button from '../form/Button.vue';
import { ButtonType, ColorVariant } from '@/utils/types/enums';
import Toggle from '../form/Toggle.vue';
import CheckBoxList from '../form/CheckBoxList.vue';
import { computed } from 'vue';
import { CheckBoxProps } from '@/utils/types/form';
import { useRecipeStore } from '@/stores/useRecipeStore.js';
import { isToday } from '@/utils/global/date.js';

const recipeStore = useRecipeStore();

const instructions = computed(() => {
  return recipeStore.recipe.instructions.map((instruction) => {
    return {
      name: instruction.instruction,
      label: instruction.instruction
    } as CheckBoxProps;
  });
});

const lastEatenToday = computed(() => {
  return isToday(recipeStore.lastEatenRecipe);
});

// Keep screen on
const { keepScreenOn } = useKeepScreenOn();
</script>
