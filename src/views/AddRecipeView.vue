<template>
  <main class="addRecipe">
    <article>
      <h2>{{ $t('addRecipePage.title') }}</h2>
      <form>
        <input-field
          id="name"
          name="name"
          :label="$t('addRecipePage.name')"
          :placeholder="$t('addRecipePage.name')"
          :ariaLabel="$t('addRecipePage.ariaLabel.name')"
          type="text"
          :required="true"
          v-model:input="newRecipe.name"
        />
        <select-field
          id="category"
          :label="$t('addRecipePage.category')"
          :ariaLabel="$t('addRecipePage.ariaLabel.category')"
          :placeholder="$t('addRecipePage.category')"
          :required="true"
          :items="Object.values(RecipeCategories).map((category) => category.toLocaleLowerCase())"
          labelPrefix="addRecipePage.categories."
          v-model:selected="newRecipe.category"
        />
        <input-field
          id="lastEaten"
          name="lastEaten"
          :label="$t('addRecipePage.lastEaten')"
          :ariaLabel="$t('addRecipePage.ariaLabel.lastEaten')"
          type="date"
          v-model:input="newRecipe.lastEaten"
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
          v-model:input="newRecipe.duration"
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
          v-model:input="newRecipe.portions"
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
          v-model:input="newRecipe.rating"
        />
        <upload-image
          id="picture"
          name="picture"
          :label="$t('addRecipePage.picture')"
          :placeholder="$t('addRecipePage.picture')"
          :ariaLabel="$t('addRecipePage.ariaLabel.picture')"
        />
        <input-list
          id="ingredients"
          :label="$t('addRecipePage.ingredients')"
          v-model:items="newRecipe.ingredients"
          v-slot="{ index }"
        >
          <input-field
            :name="'amount ' + index"
            :placeholder="$t('addRecipePage.amount')"
            :ariaLabel="$t('addRecipePage.ariaLabel.amount')"
            type="number"
            v-model:input="newRecipe.ingredients[index].amount"
          />
          <select-field
            :ariaLabel="$t('addRecipePage.ariaLabel.unit')"
            :placeholder="$t('addRecipePage.unit')"
            :items="Object.values(RecipeUnits).map((unit) => unit.toLocaleLowerCase())"
            labelPrefix="addRecipePage.units."
            v-model:selected="newRecipe.ingredients[index].unit"
          />
          <input-field
            :name="'ingredient ' + index"
            :placeholder="$t('addRecipePage.ingredient')"
            :ariaLabel="$t('addRecipePage.ariaLabel.ingredient')"
            type="text"
            v-model:input="newRecipe.ingredients[index].name"
            @input="addInputRow(newRecipe.ingredients, index, { amount: 0, unit: '', name: '' })"
          />
        </input-list>
        <input-list
          id="instructions"
          :label="$t('addRecipePage.instructions')"
          v-model:items="newRecipe.instructions"
          v-slot="{ index }"
        >
          <input-field
            :name="'instruction ' + index"
            :placeholder="$t('addRecipePage.instruction')"
            :ariaLabel="$t('addRecipePage.ariaLabel.instruction')"
            type="text"
            v-model:input="newRecipe.instructions[index]"
            @input="addInputRow(newRecipe.instructions, index, '')"
          />
        </input-list>
        <text-area
          id="notes"
          name="notes"
          :label="$t('addRecipePage.notes')"
          :placeholder="$t('addRecipePage.notes')"
          :ariaLabel="$t('addRecipePage.ariaLabel.notes')"
          v-model:input="newRecipe.notes"
        />
        <error-message v-model:message="errorMessage" />
        <button @click.prevent="saveRecipe" id="save" type="submit">
          {{ $t('addRecipePage.save') }}
        </button>
      </form>
    </article>
  </main>
</template>

<script setup lang="ts">
import { RecipeCategories, RecipeUnits, type Recipe } from '@/utils/types/recipe';
import { ref } from 'vue';
import { addInputRow } from '@/utils/list';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import InputField from '@/components/form/InputField.vue';
import InputList from '@/components/form/InputList.vue';
import SelectField from '@/components/form/SelectField.vue';
import TextArea from '@/components/form/TextArea.vue';
import UploadImage from '@/components/form/UploadImage.vue';
import i18n from '@/i18n';
import { addData } from '@/utils/db';

const newRecipe = ref<Recipe>({
  id: '',
  name: '',
  category: '',
  duration: undefined,
  portions: undefined,
  rating: undefined,
  picture: '',
  ingredients: [{ amount: 0, unit: '', name: '' }],
  instructions: [''],
  lastEaten: undefined,
  notes: ''
});

const errorMessage = ref<string>('');

/**
 * Save the new recipe
 */
async function saveRecipe() {
  // Check if all required fields are filled
  if (newRecipe.value.name === '') {
    errorMessage.value = i18n.global.t('addRecipePage.errors.name');
  } else if (newRecipe.value.category === '') {
    errorMessage.value = i18n.global.t('addRecipePage.errors.category');
  } else if (newRecipe.value.duration === undefined) {
    errorMessage.value = i18n.global.t('addRecipePage.errors.duration');
  } else if (newRecipe.value.portions === undefined) {
    errorMessage.value = i18n.global.t('addRecipePage.errors.portions');
  } else if (newRecipe.value.rating === undefined) {
    errorMessage.value = i18n.global.t('addRecipePage.errors.rating');
  } else if (
    newRecipe.value.ingredients[0].amount === 0 ||
    newRecipe.value.ingredients[0].unit === '' ||
    newRecipe.value.ingredients[0].name === ''
  ) {
    errorMessage.value = i18n.global.t('addRecipePage.errors.ingredients');
  } else if (newRecipe.value.instructions[0] === '') {
    errorMessage.value = i18n.global.t('addRecipePage.errors.instructions');
  } else {
    // Clean up the recipe
    newRecipe.value.id = crypto.randomUUID();
    newRecipe.value.lastEaten = new Date();
    newRecipe.value.ingredients = newRecipe.value.ingredients.filter(
      (ingredient) => ingredient.amount !== 0 && ingredient.unit !== '' && ingredient.name !== ''
    );
    newRecipe.value.instructions = newRecipe.value.instructions.filter(
      (instruction) => instruction !== ''
    );

    // Save the recipe
    try {
      await addData('recipes', newRecipe.value);
      //Save picture
    } catch (error) {
      errorMessage.value = i18n.global.t('addRecipePage.errors.save');
    }
  }
}
</script>
