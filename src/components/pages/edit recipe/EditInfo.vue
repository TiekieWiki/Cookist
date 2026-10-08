<template>
  <section class="card">
    <InputField
      id="name"
      name="name"
      :label="$t('editRecipePage.name')"
      :placeholder="$t('editRecipePage.placeholder.name')"
      :ariaLabel="$t('editRecipePage.ariaLabel.name')"
      type="text"
      :required="true"
      :error="errors.name"
      v-model:input="recipe.name"
    />
    <SelectField
      id="category"
      :label="$t('general.recipe.category')"
      :ariaLabel="$t('editRecipePage.ariaLabel.category')"
      :placeholder="$t('editRecipePage.placeholder.category')"
      :required="true"
      :items="categoryOptions"
      labelPrefix="general.recipe.categories."
      :error="errors.category"
      v-model:selected="recipe.category"
    />
    <div class="compact">
      <InputField
        id="duration"
        name="duration"
        :label="$t('editRecipePage.duration')"
        :placeholder="$t('editRecipePage.placeholder.duration')"
        :ariaLabel="$t('editRecipePage.ariaLabel.duration')"
        type="number"
        :required="true"
        :min="1"
        :error="errors.duration"
        v-model:input="recipe.duration"
      />
      <InputField
        id="portions"
        name="portions"
        :label="$t('editRecipePage.portions')"
        :placeholder="$t('editRecipePage.placeholder.portions')"
        :ariaLabel="$t('editRecipePage.ariaLabel.portions')"
        type="number"
        :required="true"
        :min="1"
        :error="errors.portions"
        v-model:input="recipe.portions"
      />
      <InputField
        id="rating"
        name="rating"
        :label="$t('editRecipePage.rating')"
        :placeholder="$t('editRecipePage.placeholder.rating')"
        :ariaLabel="$t('editRecipePage.ariaLabel.rating')"
        type="number"
        :required="true"
        :min="0"
        :max="5"
        :error="errors.rating"
        v-model:input="recipe.rating"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { RecipeCategories, type Recipe } from '@/utils/types/recipe';
import InputField from '@/components/form/InputField.vue';
import SelectField from '@/components/form/SelectField.vue';
import { toSelectOptions } from '@/utils/global/selectOptions';
import { type RecipeErrors } from '@/utils/recipe/validateRecipe';

defineProps<{ errors: RecipeErrors }>();

const recipe = defineModel<Recipe>('recipe', { required: true });

const categoryOptions = toSelectOptions(RecipeCategories);
</script>
