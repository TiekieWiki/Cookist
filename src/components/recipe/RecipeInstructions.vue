<template>
  <section class="instructions card">
    <div class="title">
      <h3>{{ $t('recipePage.instructions') }}</h3>
      <div class="actions">
        <p>{{ $t('recipePage.keepOnScreen') }}</p>
        <Toggle @click="keepScreenOn = !keepScreenOn" />
      </div>
    </div>
    <CheckBoxList v-model:items="instructions" />
  </section>
</template>

<script setup lang="ts">
import { useKeepScreenOn } from '@/composables/useKeepScreenOn';
import Toggle from '../form/Toggle.vue';
import CheckBoxList from '../form/CheckBoxList.vue';
import { computed } from 'vue';
import { CheckBoxProps } from '@/utils/types/form';
import { useRecipeStore } from '@/stores/useRecipeStore.js';

const recipeStore = useRecipeStore();

const instructions = computed(() => {
  return recipeStore.recipe.instructions.map((instruction) => {
    return {
      name: instruction.instruction,
      label: instruction.instruction
    } as CheckBoxProps;
  });
});

const { keepScreenOn } = useKeepScreenOn();
</script>
