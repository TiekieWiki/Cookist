<template>
  <section class="searchOrder">
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
    <Button
      class="mobile"
      @click="openFilters = !openFilters"
      :type="ButtonType.BUTTON"
      :variant="ColorVariant.SECONDARY"
      :size="Size.LARGE"
    >
      <font-awesome-icon :icon="['fas', 'sliders']" />
      {{ $t('recipesPage.filters') }}
    </Button>
  </section>
</template>

<script setup lang="ts">
import InputField from '@/components/form/InputField.vue';
import SelectField from '@/components/form/SelectField.vue';
import { type Filter, RecipeOrderCategories } from '@/utils/types/orderFilter';
import { ref } from 'vue';
import { AutoCompleteVariant, ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import Button from '@/components/form/Button.vue';

const openFilters = defineModel<boolean>('openFilters', { required: true });
const filter = defineModel<Filter>('filter', { required: true });

const order = ref<RecipeOrderCategories>(RecipeOrderCategories.durationAsc);
</script>
