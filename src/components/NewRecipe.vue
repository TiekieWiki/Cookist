<template>
  <div>
    <input-field
      id="name"
      name="name"
      :label="$t('addRecipePage.name')"
      :placeholder="$t('addRecipePage.name')"
      :ariaLabel="$t('addRecipePage.ariaLabel.name')"
      type="text"
      :required="true"
      v-model:input="recipe.name"
    />
    <select-field
      id="category"
      :label="$t('addRecipePage.category')"
      :ariaLabel="$t('addRecipePage.ariaLabel.category')"
      :placeholder="$t('addRecipePage.category')"
      :required="true"
      :items="Object.values(RecipeCategories).map((category) => category.toLocaleLowerCase())"
      labelPrefix="addRecipePage.categories."
      v-model:selected="recipe.category"
    />
    <input-field
      id="lastEaten"
      name="lastEaten"
      :label="$t('addRecipePage.lastEaten')"
      :ariaLabel="$t('addRecipePage.ariaLabel.lastEaten')"
      type="date"
      v-model:input="recipe.lastEaten"
    />
    <input-field
      id="duration"
      name="duration"
      :label="$t('addRecipePage.duration')"
      :placeholder="$t('addRecipePage.duration')"
      :ariaLabel="$t('addRecipePage.ariaLabel.duration')"
      type="number"
      :required="true"
      :min="1"
      v-model:input="recipe.duration"
    />
    <input-field
      id="portions"
      name="portions"
      :label="$t('addRecipePage.portions')"
      :placeholder="$t('addRecipePage.portions')"
      :ariaLabel="$t('addRecipePage.ariaLabel.portions')"
      type="number"
      :required="true"
      :min="1"
      v-model:input="recipe.portions"
    />
    <input-field
      id="rating"
      name="rating"
      :label="$t('addRecipePage.rating')"
      :placeholder="$t('addRecipePage.rating')"
      :ariaLabel="$t('addRecipePage.ariaLabel.rating')"
      type="number"
      :required="true"
      :min="0"
      :max="5"
      v-model:input="recipe.rating"
    />
    <input-list
      id="ingredients"
      :label="$t('addRecipePage.ingredients')"
      v-model:items="recipe.ingredients"
      v-slot="{ index }"
    >
      <input-field
        :name="'amount ' + index"
        :placeholder="$t('addRecipePage.amount')"
        :ariaLabel="$t('addRecipePage.ariaLabel.amount')"
        type="number"
        v-model:input="recipe.ingredients[index].amount"
      />
      <select-field
        :ariaLabel="$t('addRecipePage.ariaLabel.unit')"
        :placeholder="$t('addRecipePage.unit')"
        :items="Object.values(RecipeUnits).map((unit) => unit.toLocaleLowerCase())"
        labelPrefix="addRecipePage.units."
        v-model:selected="recipe.ingredients[index].unit"
      />
      <input-field
        :name="'ingredient ' + index"
        :placeholder="$t('addRecipePage.ingredient')"
        :ariaLabel="$t('addRecipePage.ariaLabel.ingredient')"
        type="text"
        v-model:input="recipe.ingredients[index].name"
        @input="addInputRow(recipe.ingredients, index, { amount: 0, unit: '', name: '' })"
      />
    </input-list>
    <input-list
      id="instructions"
      :label="$t('addRecipePage.instructions')"
      v-model:items="recipe.instructions"
      v-slot="{ index }"
    >
      <input-field
        :name="'instruction ' + index"
        :placeholder="$t('addRecipePage.instruction')"
        :ariaLabel="$t('addRecipePage.ariaLabel.instruction')"
        type="text"
        v-model:input="recipe.instructions[index]"
        @input="addInputRow(recipe.instructions, index, '')"
      />
    </input-list>
    <text-area
      id="notes"
      name="notes"
      :label="$t('addRecipePage.notes')"
      :placeholder="$t('addRecipePage.notes')"
      :ariaLabel="$t('addRecipePage.ariaLabel.notes')"
      v-model:input="recipe.notes"
    />
  </div>
  <upload-image
    id="image"
    name="image"
    :label="$t('addRecipePage.image')"
    :placeholder="$t('addRecipePage.image')"
    :ariaLabel="$t('addRecipePage.ariaLabel.image')"
    :oldImage="recipe.image"
    @image="(i: File | null) => (image = i)"
  />
  <error-message v-model:message="errorMessage" />
</template>

<script setup lang="ts">
import { RecipeCategories, RecipeUnits, type Recipe } from '@/utils/types/recipe';
import { addInputRow } from '@/utils/newRecipe/list';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import InputField from '@/components/form/InputField.vue';
import InputList from '@/components/form/InputList.vue';
import SelectField from '@/components/form/SelectField.vue';
import TextArea from '@/components/form/TextArea.vue';
import UploadImage from '@/components/form/UploadImage.vue';

const recipe = defineModel<Recipe>('recipe', { required: true });
const errorMessage = defineModel<string>('errorMessage', { required: true });
const image = defineModel<File | null>('image', { required: true });
</script>
