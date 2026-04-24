<template>
  <article>
    <section>
      <h3>{{ $t('recipePage.instructions') }}</h3>
      <div>
        {{ $t('recipePage.keepOnScreen') }}
        <Toggle @click="keepScreenOn = !keepScreenOn" />
      </div>
    </section>
    <CheckBoxList v-model:items="instructions" />
    <Button @click="updateLastEaten" :disabled="lastEatenToday" :type="ButtonType.BUTTON">
      <font-awesome-icon v-if="lastEatenToday" :icon="['fas', 'check']" />
      <font-awesome-icon v-else :icon="['fas', 'calendar']" />
      {{ $t('recipePage.eatenToday') }}
    </Button>
  </article>
</template>

<script setup lang="ts">
import { useKeepScreenOn } from '@/composables/useKeepScreenOn';
import { useRecipe } from '@/composables/useRecipe';
import { capitalizeFirstLetter } from '@/utils/global/text';
import Button from '../form/Button.vue';
import { ButtonType } from '@/utils/types/enums';
import Toggle from '../form/Toggle.vue';
import CheckBoxList from '../form/CheckBoxList.vue';
import { computed } from 'vue';
import { CheckBoxProps } from '@/utils/types/form';

const { recipe, lastEatenToday, updateLastEaten } = useRecipe();

const instructions = computed(() => {
  return recipe.value.instructions.map((instruction) => {
    return {
      name: instruction,
      label: capitalizeFirstLetter(instruction)
    } as CheckBoxProps;
  });
});

// Keep screen on
const { keepScreenOn } = useKeepScreenOn();
</script>
