<template>
  <section>
    <h3>{{ recipe.name }}</h3>
    <div v-if="recipe.rating">
      <font-awesome-icon v-for="n in recipe.rating" :icon="['fas', 'star']" :key="n" />
      <font-awesome-icon v-for="n in 5 - recipe.rating!" :icon="['far', 'star']" :key="n" />
    </div>
    <p>{{ recipe.category }}</p>
    |
    <p><font-awesome-icon :icon="['far', 'clock']" /> {{ recipe.duration }}</p>
    |
    <p>
      <font-awesome-icon :icon="['fas', 'utensils']" />

      {{ recipe.portions }}
    </p>
    <template v-if="lastEaten">
      |
      <p>
        <font-awesome-icon :icon="['fas', 'calendar']" />
        {{ lastEaten }}
      </p>
    </template>
  </section>
</template>

<script lang="ts" setup>
import type { Recipe } from '@/utils/types/recipe';
import { useLastEatenStore } from '@/stores/useLastEatenStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const props = defineProps<{
  recipe: Recipe;
}>();

const lastEatenStore = useLastEatenStore();
const { lastEaten } = storeToRefs(lastEatenStore);

onMounted(() => {
  lastEatenStore.getLastEaten(props.recipe.id);
});
</script>
