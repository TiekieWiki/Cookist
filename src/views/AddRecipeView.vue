<template>
  <form>
    <label>{{ $t('addRecipePage.name') }}</label>
    <input
      type="text"
      :placeholder="$t('addRecipePage.name')"
      v-model="newRecipe.name"
      name="name"
      :aria-label="$t('addRecipePage.ariaLabel.name')"
    />
    <label>{{ $t('addRecipePage.category') }}</label>
    <select
      v-model="newRecipe.category"
      name="category"
      :aria-label="$t('addRecipePage.ariaLabel.category')"
    >
      <option value="" disabled>{{ $t('addRecipePage.category') }}</option>
      <option v-for="category in RecipeCategories" :key="category" :value="category">
        {{ $t('addRecipePage.categories.' + category) }}
      </option>
    </select>
    <label>{{ $t('addRecipePage.duration') }}</label>
    <input
      type="number"
      min="1"
      :placeholder="$t('addRecipePage.duration')"
      v-model="newRecipe.duration"
      name="duration"
      :aria-label="$t('addRecipePage.ariaLabel.duration')"
    />
    <label>{{ $t('addRecipePage.portions') }}</label>
    <input
      type="number"
      min="1"
      :placeholder="$t('addRecipePage.portions')"
      v-model="newRecipe.portions"
      name="portions"
      :aria-label="$t('addRecipePage.ariaLabel.portions')"
    />
    <label>{{ $t('addRecipePage.rating') }}</label>
    <input
      type="number"
      min="0"
      max="5"
      :placeholder="$t('addRecipePage.rating')"
      v-model="newRecipe.rating"
      name="rating"
      :aria-label="$t('addRecipePage.ariaLabel.rating')"
    />
    <label>{{ $t('addRecipePage.picture') }}</label>
    <input
      type="file"
      accept="image/*"
      :placeholder="$t('addRecipePage.picture')"
      @change="uploadImage"
      name="picture"
      :aria-label="$t('addRecipePage.ariaLabel.picture')"
    />
    <img :src="previewImage" />
    <label>{{ $t('addRecipePage.ingredients') }}</label>
    <div v-for="(ingredient, index) in newRecipe.ingredients" :key="index">
      <input
        type="number"
        :placeholder="$t('addRecipePage.amount')"
        v-model="ingredient.amount"
        name="amount"
        :aria-label="$t('addRecipePage.ariaLabel.amount')"
      />
      <select
        v-model="ingredient.unit"
        name="unit"
        :aria-label="$t('addRecipePage.ariaLabel.unit')"
      >
        <option value="" disabled>{{ $t('addRecipePage.unit') }}</option>
        <option v-for="unit in RecipeUnits" :key="unit" :value="unit">
          {{ $t('addRecipePage.units.' + unit) }}
        </option>
      </select>
      <input
        type="text"
        :placeholder="$t('addRecipePage.ingredient')"
        v-model="ingredient.name"
        name="ingredient"
        :aria-label="$t('addRecipePage.ariaLabel.ingredient')"
        @input="addInputRow(newRecipe.ingredients, index)"
      />
      <button @click="deleteRow(newRecipe.ingredients, index)" type="button">Trash</button>
    </div>
    <label>{{ $t('addRecipePage.instructions') }}</label>
    <div v-for="(instruction, index) in newRecipe.instructions" :key="index">
      <input
        type="text"
        :placeholder="$t('addRecipePage.instruction')"
        v-model="newRecipe.instructions[index]"
        name="instruction"
        :aria-label="$t('addRecipePage.ariaLabel.instruction')"
        @input="addInputRow(newRecipe.instructions, index)"
      />
      <button @click="deleteRow(newRecipe.instructions, index)" type="button">Trash</button>
    </div>
    <label>{{ $t('addRecipePage.lastEaten') }}</label>
    <input
      type="date"
      v-model="newRecipe.lastEaten"
      name="lastEaten"
      :aria-label="$t('addRecipePage.ariaLabel.lastEaten')"
    />
    <label>{{ $t('addRecipePage.notes') }}</label>
    <textarea
      :placeholder="$t('addRecipePage.notes')"
      v-model="newRecipe.notes"
      name="notes"
      :aria-label="$t('addRecipePage.ariaLabel.notes')"
    />
    <button type="submit">{{ $t('addRecipePage.save') }}</button>
  </form>
</template>

<script setup lang="ts">
import { RecipeCategories, RecipeUnits, type Recipe } from '@/utils/types/recipe';
import { ref } from 'vue';

const newRecipe = ref<Recipe>({
  id: '',
  name: '',
  category: '',
  duration: 0,
  portions: 0,
  rating: 0,
  picture: '',
  ingredients: [{ amount: 0, unit: '', name: '' }],
  instructions: [''],
  lastEaten: new Date(),
  notes: ''
});

// Upload image
const previewImage = ref('');

/**
 * Upload image
 * @param event Upload event
 */
function uploadImage(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const image = target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      previewImage.value = reader.result as string;
    };
  }
}

// Add or delete input rows
/**
 * Add an input row to the list of ingredients or instructions
 * @param list List of ingredients or instructions
 * @param index Index of the current ingredient or instruction
 */
function addInputRow(list: Object[] | string[], index: number) {
  if (index === list.length - 1 && list[index] !== '') {
    list.push('');
  }
}

/**
 * Delete an input row from the list of ingredients or instructions
 * @param list List of ingredients or instructions
 * @param index Index of the current ingredient or instruction
 */
function deleteRow(list: Object[] | string[], index: number) {
  if (list.length > 1) {
    list.splice(index, 1);
  }
}
</script>
