<template>
  <article>
    <section>
      <InputField
        id="search"
        name="search"
        :ariaLabel="$t('recipesPage.ariaLabel.search')"
        type="text"
        :placeholder="$t('recipesPage.placeholder.search')"
        :required="false"
        :disabled="false"
        :autocomplete="AutoCompleteVariant.OFF"
        v-model:input="filter.name"
      />
      <Button @click="openFilter = !openFilter" :type="ButtonType.BUTTON">
        <font-awesome-icon :icon="['fas', 'filter']" />
        {{ $t('recipesPage.filter') }}
      </Button>
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
import { Filter, RecipeOrderCategories } from '@/utils/types/orderFilter';
import { ref } from 'vue';
import { AutoCompleteVariant, ButtonType } from '@/utils/types/enums';
import Button from '../form/Button.vue';
import i18n from '@/i18n/index.js';
import { RecipeCategories } from '@/utils/types/recipe.js';

const filter = ref<Filter>({
  name: '',
  categories: Object.values(RecipeCategories).map((category) => ({
    id: category,
    name: category,
    label: i18n.global.t(`editRecipePage.categories.${category}`),
    required: false,
    disabled: false,
    autocomplete: 'off',
    checked: false
  })),
  durationMin: 0,
  durationMax: 10080,
  ratingMin: 0,
  ratingMax: 5,
  lastEatenMin: new Date(0).toISOString().slice(0, 10),
  lastEatenMax: new Date('9999-12-31').toISOString().slice(0, 10),
  ingredients: [{ name: '' }]
});

const order = ref<RecipeOrderCategories>(RecipeOrderCategories.durationAsc);

// Toggle the filter menu
const openFilter = ref<boolean>(false);
</script>
