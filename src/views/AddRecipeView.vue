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
          v-model:input="newRecipe.name"
        />
        <select-field
          id="category"
          :label="$t('addRecipePage.category')"
          :ariaLabel="$t('addRecipePage.ariaLabel.category')"
          :placeholder="$t('addRecipePage.category')"
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
            @input="addInputRow(newRecipe.instructions, index)"
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
        <button id="save" type="submit">{{ $t('addRecipePage.save') }}</button>
      </form>
    </article>
  </main>
</template>

<script setup lang="ts">
import { RecipeCategories, RecipeUnits, type Recipe } from '@/utils/types/recipe';
import { ref } from 'vue';
import { addInputRow, deleteRow } from '@/utils/list';
import InputField from '@/components/form/InputField.vue';
import InputList from '@/components/form/InputList.vue';
import SelectField from '@/components/form/SelectField.vue';
import TextArea from '@/components/form/TextArea.vue';
import UploadImage from '@/components/form/UploadImage.vue';

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
</script>
