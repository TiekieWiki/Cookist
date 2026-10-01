<template>
  <router-link :id="recipe.id" :to="`/recipe/${recipe.id}`" tabindex="0">
    <section class="recipeCard">
      <div class="image">
        <img :src="image" :alt="recipe.name" />
        <Pill :variant="ColorVariant.SECONDARY" :size="Size.MEDIUM">
          {{ lastEaten ? lastEaten : $t('general.recipe.neverCooked') }}
        </Pill>
      </div>
      <div class="content">
        <h3>{{ recipe.name }}</h3>
        <p v-if="recipe.notes">{{ recipe.notes }}</p>
        <div class="info">
          <p class="small">
            <font-awesome-icon :icon="['far', 'clock']" /> {{ recipe.duration }}
            {{ $t('general.recipe.minutes') }}
          </p>
          <p class="small">
            <font-awesome-icon :icon="['fas', 'user-group']" />

            {{ recipe.portions }}
          </p>
          <p class="small">
            <font-awesome-icon :icon="['fas', 'bowl-food']" />
            {{ $t('general.recipe.categories.' + recipe.category) }}
          </p>
          <p v-if="recipe.rating" class="small">
            <font-awesome-icon :icon="['fas', 'star']" />
            {{ recipe.rating }}
          </p>
        </div>
      </div>
    </section>
  </router-link>
</template>

<script lang="ts" setup>
import type { RecipeSummary } from '@/utils/types/recipe';
import { formatDateAgo } from '@/utils/global/date';
import { computed } from 'vue';
import Pill from '@/components/general/Pill.vue';
import { ColorVariant, Size } from '@/utils/types/enums';

const props = defineProps<{
  recipe: RecipeSummary;
  image: string;
}>();

const lastEaten = computed(() => formatDateAgo(props.recipe.last_eaten ?? null));
</script>
