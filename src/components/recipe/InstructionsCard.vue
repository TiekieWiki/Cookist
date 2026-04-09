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
    <button @click="updateLastEaten" :disabled="lastEatenToday" class="icon" type="button">
      <font-awesome-icon v-if="lastEatenToday" :icon="['fas', 'check']" />
      <font-awesome-icon v-else :icon="['fas', 'calendar']" />{{ $t('recipePage.eatenToday') }}
    </button>
  </article>
</template>

<script setup lang="ts">
import { useKeepScreenOn } from '@/composables/useKeepScreenOn';
import { useRecipe } from '@/composables/useRecipe';
import { capitalizeFirstLetter } from '@/utils/global/text';

const { recipe, lastEatenToday, updateLastEaten } = useRecipe();

// Keep screen on
const { keepScreenOn } = useKeepScreenOn();
</script>
