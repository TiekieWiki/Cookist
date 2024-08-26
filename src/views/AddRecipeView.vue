<template>
  <main class="addRecipe">
    <article>
      <h2>{{ $t('addRecipePage.title') }}</h2>
      <form>
        <label id="name"
          >{{ $t('addRecipePage.name') }}
          <input
            type="text"
            :placeholder="$t('addRecipePage.name')"
            v-model="newRecipe.name"
            name="name"
            :aria-label="$t('addRecipePage.ariaLabel.name')"
          />
        </label>
        <label id="category"
          >{{ $t('addRecipePage.category') }}
          <div class="select">
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
          </div>
        </label>
        <label id="lastEaten"
          >{{ $t('addRecipePage.lastEaten') }}
          <input
            type="date"
            v-model="newRecipe.lastEaten"
            name="lastEaten"
            :aria-label="$t('addRecipePage.ariaLabel.lastEaten')"
          />
        </label>
        <label id="duration"
          >{{ $t('addRecipePage.duration') }}
          <input
            type="number"
            min="1"
            :placeholder="$t('addRecipePage.duration')"
            v-model="newRecipe.duration"
            name="duration"
            :aria-label="$t('addRecipePage.ariaLabel.duration')"
          />
        </label>
        <label id="portions"
          >{{ $t('addRecipePage.portions') }}
          <input
            type="number"
            min="1"
            :placeholder="$t('addRecipePage.portions')"
            v-model="newRecipe.portions"
            name="portions"
            :aria-label="$t('addRecipePage.ariaLabel.portions')"
          />
        </label>
        <label id="rating"
          >{{ $t('addRecipePage.rating') }}
          <input
            type="number"
            min="0"
            max="5"
            :placeholder="$t('addRecipePage.rating')"
            v-model="newRecipe.rating"
            name="rating"
            :aria-label="$t('addRecipePage.ariaLabel.rating')"
          />
        </label>
        <label id="picture"
          >{{ $t('addRecipePage.picture') }}
          <div>
            <input
              type="file"
              accept="image/*"
              :placeholder="$t('addRecipePage.picture')"
              @change="uploadImage"
              name="picture"
              :aria-label="$t('addRecipePage.ariaLabel.picture')"
            />
            <img :src="previewImage" />
          </div>
        </label>
        <label id="ingredients"
          >{{ $t('addRecipePage.ingredients') }}
          <div class="list">
            <div v-for="(ingredient, index) in newRecipe.ingredients" :key="index">
              <input
                type="number"
                :placeholder="$t('addRecipePage.amount')"
                v-model="ingredient.amount"
                name="amount"
                :aria-label="$t('addRecipePage.ariaLabel.amount')"
              />
              <div class="select">
                <select
                  v-model="ingredient.unit"
                  name="unit"
                  :aria-label="$t('addRecipePage.ariaLabel.unit')"
                >
                  <option value="" disabled>{{ $t('addRecipePage.unit') }}</option>
                  <option v-for="unit in RecipeUnits" :key="unit" :value="unit">
                    {{ unit }}
                  </option>
                </select>
              </div>
              <input
                type="text"
                :placeholder="$t('addRecipePage.ingredient')"
                v-model="ingredient.name"
                name="ingredient"
                :aria-label="$t('addRecipePage.ariaLabel.ingredient')"
                @input="addInputRow(newRecipe.ingredients, index)"
              />
              <button @click="deleteRow(newRecipe.ingredients, index)" class="delete" type="button">
                <font-awesome-icon :icon="['fas', 'trash-can']" />
              </button>
            </div>
          </div>
        </label>
        <label id="instructions"
          >{{ $t('addRecipePage.instructions') }}
          <div class="list">
            <div v-for="(instruction, index) in newRecipe.instructions" :key="index">
              <input
                type="text"
                :placeholder="$t('addRecipePage.instruction')"
                v-model="newRecipe.instructions[index]"
                name="instruction"
                :aria-label="$t('addRecipePage.ariaLabel.instruction')"
                @input="addInputRow(newRecipe.instructions, index)"
              />
              <button
                @click="deleteRow(newRecipe.instructions, index)"
                class="delete"
                type="button"
              >
                <font-awesome-icon :icon="['fas', 'trash-can']" />
              </button>
            </div>
          </div>
        </label>
        <label id="notes"
          >{{ $t('addRecipePage.notes') }}
          <textarea
            :placeholder="$t('addRecipePage.notes')"
            v-model="newRecipe.notes"
            name="notes"
            :aria-label="$t('addRecipePage.ariaLabel.notes')"
          />
        </label>
        <button id="save" type="submit">{{ $t('addRecipePage.save') }}</button>
      </form>
    </article>
  </main>
</template>

<script setup lang="ts">
import { RecipeCategories, RecipeUnits, type Recipe } from '@/utils/types/recipe';
import { ref } from 'vue';

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
