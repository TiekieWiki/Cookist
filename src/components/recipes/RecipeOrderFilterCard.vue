<template>
  <article>
    <section class="header">
      <h2>{{ $t('recipesPage.title') }}</h2>
      <SelectField
        id="cookGroup"
        :ariaLabel="$t('recipesPage.ariaLabel.cookGroups')"
        :placeholder="$t('recipesPage.placeholder.cookGroups')"
        :required="false"
        :items="
          cookGroups.map((group) => ({
            value: group.id,
            label: capitalizeFirstLetter(group.name)
          }))
        "
        v-model:selected="selectedCookGroup"
      />
    </section>
    <section class="orderFilter">
      <InputField
        id="search"
        name="search"
        :ariaLabel="$t('recipesPage.ariaLabel.search')"
        type="text"
        :placeholder="$t('recipesPage.placeholder.search')"
        :required="false"
        :disabled="false"
        :autocomplete="'off'"
        v-model:input="filter.name"
      />
      <button @click="openFilter = !openFilter" type="button">
        <font-awesome-icon :icon="['fas', 'filter']" />{{ $t('recipesPage.filter') }}
      </button>
      <SelectField
        id="order"
        :ariaLabel="$t('recipesPage.ariaLabel.order')"
        :placeholder="$t('recipesPage.placeholder.order')"
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
    </section>
    <Transition name="fade">
      <RecipesFilter v-if="openFilter" v-model:filter="filter" />
    </Transition>
  </article>
</template>

<script setup lang="ts">
import InputField from '@/components/form/InputField.vue';
import SelectField from '@/components/form/SelectField.vue';
import RecipesFilter from '@/components/recipes/RecipesFilter.vue';
import { useRecipes } from '@/composables/useRecipes';
import { RecipeOrderCategories } from '@/utils/types/orderFilter';
import { ref } from 'vue';
import { capitalizeFirstLetter } from '@/utils/global/text';

const { cookGroups, selectedCookGroup, order, filter } = useRecipes();

// Toggle the filter menu
const openFilter = ref<boolean>(false);
</script>
