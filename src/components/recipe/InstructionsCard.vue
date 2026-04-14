<template>
  <article>
    <section class="title">
      <h3>{{ $t('recipePage.instructions') }}</h3>
      <div class="actions">
        {{ $t('recipePage.keepOnScreen') }}
        <label @click="keepScreenOn = !keepScreenOn" class="toggle">
          <input type="checkbox" />
          <span class="slider"></span>
        </label>
      </div>
    </section>
    <div class="label-group">
      <label v-for="instruction in recipe.instructions" :key="instruction">
        <input :name="instruction" type="checkbox" />
        {{ capitalizeFirstLetter(instruction) }}
      </label>
    </div>
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

const { recipe, lastEatenToday, updateLastEaten } = useRecipe();

// Keep screen on
const { keepScreenOn } = useKeepScreenOn();
</script>
