<template>
  <section class="instructions card">
    <div class="title">
      <h3>{{ $t('recipePage.instructions') }}</h3>
      <div class="actions">
        <DropDown>
          <div class="keepScreenOn">
            <p>{{ $t('recipePage.keepOnScreen') }}</p>
            <Toggle v-model:input="keepScreenOn" />
          </div>
        </DropDown>
      </div>
    </div>
    <CheckBoxList :items="instructions" />
  </section>
</template>

<script setup lang="ts">
import { useKeepScreenOn } from '@/composables/useKeepScreenOn';
import Toggle from '@/components/form/Toggle.vue';
import CheckBoxList from '@/components/form/CheckBoxList.vue';
import { computed } from 'vue';
import { type CheckBoxProps } from '@/utils/types/form';
import { useRecipeStore } from '@/stores/useRecipeStore.js';
import DropDown from '@/components/general/DropDown.vue';

const recipeStore = useRecipeStore();

const instructions = computed<CheckBoxProps[]>(() =>
  (recipeStore.recipe.instructions ?? []).map((instruction) => ({
    name: instruction.instruction,
    label: instruction.instruction
  }))
);

const { keepScreenOn } = useKeepScreenOn();
</script>
