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
      v-model:input="recipe.name"
    />
    <SelectField
      id="category"
      :label="$t('editRecipePage.category')"
      :ariaLabel="$t('editRecipePage.ariaLabel.category')"
      :placeholder="$t('editRecipePage.placeholder.category')"
      :required="true"
      :items="
        Object.values(RecipeCategories).map((category) => ({
          value: category.toLowerCase(),
          label: category.toLowerCase()
        }))
      "
      labelPrefix="editRecipePage.categories."
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
        v-model:input="recipe.rating"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { RecipeCategories, type Recipe } from '@/utils/types/recipe';
import InputField from '@/components/form/InputField.vue';
import SelectField from '@/components/form/SelectField.vue';

const recipe = defineModel<Recipe>('recipe', { required: true });
const save = defineEmits<{ save: [boolean] }>();
</script>
