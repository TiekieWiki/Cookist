<template>
  <div class="orderFilter">
    <input-field
      id="search"
      name="search"
      :ariaLabel="$t('recipesPage.ariaLabel.search')"
      type="text"
      :placeholder="$t('recipesPage.searchPlaceholder')"
      :required="false"
      :disabled="false"
      :autocomplete="'off'"
      v-model:input="filter.name"
    />
    <button @click="openFilter = !openFilter" type="button">
      <font-awesome-icon :icon="['fas', 'filter']" />{{ $t('recipesPage.filter') }}
    </button>
    <select-field
      id="order"
      :ariaLabel="$t('recipesPage.ariaLabel.order')"
      :placeholder="$t('recipesPage.order')"
      :required="false"
      :items="
        Object.values(RecipeOrderCategories).map((category) => ({
          value: category,
          label: category
        }))
      "
      labelPrefix="recipesPage.orders."
      v-model:selected="order"
    />
  </div>
  <Transition name="fade">
    <recipes-filter v-if="openFilter" v-model:filter="filter" />
  </Transition>
</template>

<script setup lang="ts">
import InputField from '@/components/form/InputField.vue';
import SelectField from '@/components/form/SelectField.vue';
import RecipesFilter from '@/components/recipe/RecipesFilter.vue';
import { RecipeOrderCategories, type Filter } from '@/utils/types/orderFilter';
import { ref } from 'vue';

const filter = defineModel<Filter>('filter', { required: true });
const order = defineModel<string>('order', { required: true });

// Toggle the filter menu
const openFilter = ref<boolean>(false);
</script>
