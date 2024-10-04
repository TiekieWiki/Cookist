<template>
  <div class="filters">
    <check-box-list
      id="category"
      :label="$t('addRecipePage.category')"
      :items="filter.categories"
    />
    <div class="rangeFilters">
      <div>
        <input-field
          id="durationMin"
          name="durationMin"
          :label="$t('recipesPage.durationMin')"
          :ariaLabel="$t('recipesPage.ariaLabel.durationMin')"
          type="number"
          :min="0"
          :max="10080"
          v-model="filter.durationMin"
        />
        <input-field
          id="durationMax"
          name="durationMax"
          :label="$t('recipesPage.durationMax')"
          :ariaLabel="$t('recipesPage.ariaLabel.durationMax')"
          type="number"
          :min="0"
          :max="10080"
          v-model="filter.durationMax"
        />
      </div>
      <div>
        <input-field
          id="ratingMin"
          name="ratingMin"
          :label="$t('recipesPage.ratingMin')"
          :ariaLabel="$t('recipesPage.ariaLabel.ratingMin')"
          type="number"
          :min="0"
          :max="5"
          v-model="filter.ratingMin"
        />
        <input-field
          id="ratingMax"
          name="ratingMax"
          :label="$t('recipesPage.ratingMax')"
          :ariaLabel="$t('recipesPage.ariaLabel.ratingMax')"
          type="number"
          :min="0"
          :max="5"
          v-model="filter.ratingMax"
        />
      </div>
      <div>
        <input-field
          id="lastEatenMin"
          name="lastEatenMin"
          :label="$t('recipesPage.lastEatenMin')"
          :ariaLabel="$t('recipesPage.ariaLabel.lastEatenMin')"
          type="date"
          v-model:input="filter.lastEatenMin"
        />
        <input-field
          id="lastEatenMax"
          name="lastEatenMax"
          :label="$t('recipesPage.lastEatenMax')"
          :ariaLabel="$t('recipesPage.ariaLabel.lastEatenMax')"
          type="date"
          v-model:axput="filter.lastEatenMax"
        />
      </div>
    </div>
    <div class="ingredients">
      <input-list
        id="ingredients"
        :label="$t('addRecipePage.ingredients')"
        v-model:items="filter.ingredients"
        v-slot="{ index }"
      >
        <input-field
          :name="'ingredient ' + index"
          :placeholder="$t('addRecipePage.ingredient')"
          :ariaLabel="$t('addRecipePage.ariaLabel.ingredient')"
          type="text"
          v-model:input="filter.ingredients[index].name"
          @input="addInputRow(filter.ingredients, index, { name: '' })"
        />
      </input-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckBoxList from '@/components/form/CheckBoxList.vue';
import InputField from '@/components/form/InputField.vue';
import InputList from '@/components/form/InputList.vue';
import { addInputRow } from '@/utils/newRecipe/list';
import type { Filter } from '@/utils/types/orderFilter';

const filter = defineModel<Filter>('filter', { required: true });
</script>
