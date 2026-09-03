<template>
  <aside :class="{ open: openFilters }">
    <Button
      class="mobile"
      :type="ButtonType.BUTTON"
      :variant="ColorVariant.TERTIARY"
      :size="Size.LARGE"
      @click="openFilters = !openFilters"
    >
      <font-awesome-icon :icon="['fas', 'xmark']" />
    </Button>
    <div class="title">
      <h3>{{ $t('recipesPage.filters') }}</h3>
      <Button :type="ButtonType.BUTTON" :variant="ColorVariant.TERTIARY" :size="Size.SMALL">
        {{ $t('recipesPage.reset') }}
      </Button>
    </div>
    <div class="divider"></div>
    <CheckBoxList
      id="category"
      :label="$t('editRecipePage.category')"
      v-model:items="filter.categories"
    />
    <div class="divider"></div>
    <div class="range">
      <InputField
        id="lastEatenMin"
        name="lastEatenMin"
        :label="$t('recipesPage.lastEaten')"
        :ariaLabel="$t('recipesPage.ariaLabel.lastEatenMin')"
        type="date"
        v-model:input="filter.lastEatenMin"
      />
      <InputField
        id="lastEatenMax"
        name="lastEatenMax"
        :ariaLabel="$t('recipesPage.ariaLabel.lastEatenMax')"
        type="date"
        v-model:input="filter.lastEatenMax"
      />
    </div>
    <div class="divider"></div>
    <div class="range">
      <InputField
        id="durationMin"
        name="durationMin"
        :label="$t('recipesPage.duration')"
        :ariaLabel="$t('recipesPage.ariaLabel.durationMin')"
        type="number"
        :min="0"
        :max="10080"
        v-model:input="filter.durationMin"
      />
      <InputField
        id="durationMax"
        name="durationMax"
        :ariaLabel="$t('recipesPage.ariaLabel.durationMax')"
        type="number"
        :min="0"
        :max="10080"
        v-model:input="filter.durationMax"
      />
    </div>
    <div class="divider"></div>
    <div class="range">
      <InputField
        id="ratingMin"
        name="ratingMin"
        :label="$t('recipesPage.rating')"
        :ariaLabel="$t('recipesPage.ariaLabel.ratingMin')"
        type="number"
        :min="0"
        :max="5"
        v-model:input="filter.ratingMin"
      />
      <InputField
        id="ratingMax"
        name="ratingMax"
        :ariaLabel="$t('recipesPage.ariaLabel.ratingMax')"
        type="number"
        :min="0"
        :max="5"
        v-model:input="filter.ratingMax"
      />
    </div>
    <div class="divider"></div>
    <InputList
      id="ingredients"
      :label="$t('editRecipePage.ingredients')"
      :colAmount="ColAmount.TWO"
      v-model:items="filter.ingredients"
      v-slot="{ index }"
    >
      <InputField
        :name="'ingredient ' + index"
        :placeholder="$t('editRecipePage.placeholder.ingredient')"
        :ariaLabel="$t('editRecipePage.ariaLabel.ingredient')"
        type="text"
        v-model:input="filter.ingredients[index].name"
        @input="index < 9 ? addInputRow(filter.ingredients, index, { name: '' }) : null"
      />
    </InputList>
  </aside>
</template>

<script setup lang="ts">
import CheckBoxList from '@/components/form/CheckBoxList.vue';
import InputField from '@/components/form/InputField.vue';
import InputList from '@/components/form/InputList.vue';
import { addInputRow } from '@/utils/global/list';
import { ButtonType, ColAmount, ColorVariant, Size } from '@/utils/types/enums';
import type { Filter } from '@/utils/types/orderFilter';
import Button from '@/components/form/Button.vue';

const openFilters = defineModel<boolean>('openFilters', { required: true });
const filter = defineModel<Filter>('filter', { required: true });
</script>
