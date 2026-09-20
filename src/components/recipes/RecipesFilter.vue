<template>
  <Transition name="slide-fade">
    <aside v-if="isDesktop || openFilters">
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
        <Button
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="Size.SMALL"
          @click="emit('reset', true)"
        >
          {{ $t('recipesPage.reset') }}
        </Button>
      </div>
      <div class="divider"></div>
      <RadioButtonList
        id="category"
        name="category"
        :label="$t('editRecipePage.category')"
        :items="categories"
        v-model:selected="filter.category"
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
          placeholder="0"
          :ariaLabel="$t('recipesPage.ariaLabel.durationMin')"
          type="number"
          :min="0"
          :max="10080"
          v-model:input="filter.durationMin"
        />
        <InputField
          id="durationMax"
          name="durationMax"
          placeholder="60"
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
          placeholder="0"
          :ariaLabel="$t('recipesPage.ariaLabel.ratingMin')"
          type="number"
          :min="0"
          :max="5"
          v-model:input="filter.ratingMin"
        />
        <InputField
          id="ratingMax"
          name="ratingMax"
          placeholder="5"
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
  </Transition>
</template>

<script setup lang="ts">
import InputField from '@/components/form/InputField.vue';
import InputList from '@/components/form/InputList.vue';
import { addInputRow } from '@/utils/global/list';
import { ButtonType, ColAmount, ColorVariant, Size } from '@/utils/types/enums';
import type { Filter } from '@/utils/types/orderFilter';
import type { RadioButtonItemProps } from '@/utils/types/form';
import { RecipeCategories } from '@/utils/types/recipe';
import Button from '@/components/form/Button.vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import RadioButtonList from '../form/RadioButtonList.vue';

const openFilters = defineModel<boolean>('openFilters', { required: true });
const filter = defineModel<Filter>('filter', { required: true });
const emit = defineEmits<{ reset: [boolean] }>();

const { t } = useI18n();

const desktop = window.matchMedia('(min-width: 1101px)');
const isDesktop = ref<boolean>(desktop.matches);

const categories = computed<RadioButtonItemProps[]>(() =>
  Object.values(RecipeCategories).map((category) => ({
    id: category,
    name: category,
    label: t(`editRecipePage.categories.${category}`),
    required: false,
    disabled: false,
    autocomplete: 'off'
  }))
);

function setIsDesktop(event: MediaQueryListEvent): void {
  isDesktop.value = event.matches;
}

onMounted(() => desktop.addEventListener('change', setIsDesktop));
onUnmounted(() => desktop.removeEventListener('change', setIsDesktop));
</script>
