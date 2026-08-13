<template>
  <form>
    <div>
      <section>
        <h2>
          {{ $route.params.recipeId ? $t('editRecipePage.title') : $t('createRecipePage.title') }}
        </h2>

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
      </section>
      <section>
        <InputList
          id="ingredients"
          :label="$t('editRecipePage.ingredients')"
          :required="true"
          :colAmount="ColAmount.FOUR"
          v-model:items="recipe.ingredients"
          v-slot="{ index }"
        >
          <InputField
            :name="'amount ' + index"
            :placeholder="$t('editRecipePage.placeholder.amount')"
            :ariaLabel="$t('editRecipePage.ariaLabel.amount')"
            :step="0.01"
            type="number"
            v-model:input="recipe.ingredients[index].amount"
          />
          <SelectField
            :ariaLabel="$t('editRecipePage.ariaLabel.unit')"
            :placeholder="$t('editRecipePage.placeholder.unit')"
            :items="
              Object.values(RecipeUnits).map((unit) => ({
                value: unit.toLowerCase(),
                label: unit.toLowerCase()
              }))
            "
            labelPrefix="editRecipePage.units."
            v-model:selected="recipe.ingredients[index].unit"
          />
          <InputField
            :name="'ingredient ' + index"
            :placeholder="$t('editRecipePage.placeholder.ingredient')"
            :ariaLabel="$t('editRecipePage.ariaLabel.ingredient')"
            type="text"
            v-model:input="recipe.ingredients[index].name"
            @input="addInputRow(recipe.ingredients, index, { amount: 0, unit: '', name: '' })"
          />
        </InputList>
      </section>
    </div>
    <div>
      <section>
        <InputList
          id="instructions"
          :label="$t('editRecipePage.instructions')"
          :required="true"
          :colAmount="ColAmount.TWO"
          v-model:items="recipe.instructions"
          v-slot="{ index }"
        >
          <InputField
            :name="'instruction ' + index"
            :placeholder="$t('editRecipePage.placeholder.instruction')"
            :ariaLabel="$t('editRecipePage.ariaLabel.instruction')"
            type="text"
            v-model:input="recipe.instructions[index].instruction"
            @input="addInputRow(recipe.instructions, index, { sort_order: index, instruction: '' })"
          />
        </InputList>
        <TextArea
          id="notes"
          name="notes"
          :label="$t('editRecipePage.notes')"
          :placeholder="$t('editRecipePage.placeholder.notes')"
          :ariaLabel="$t('editRecipePage.ariaLabel.notes')"
          v-model:input="recipe.notes"
        />
      </section>
      <section>
        <UploadImage
          id="image"
          name="image"
          :label="$t('editRecipePage.image')"
          :placeholder="$t('editRecipePage.placeholder.image')"
          :ariaLabel="$t('editRecipePage.ariaLabel.image')"
          :oldImage="image as string"
          @image="(i: File | null) => (image = i)"
        />
      </section>
      <section>
        <ErrorMessage v-model:message="errorMessage" />
        <Button
          @click="$emit('save', true)"
          id="save"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.SECONDARY"
        >
          {{ $t('editRecipePage.save') }}
        </Button>
      </section>
    </div>
  </form>
</template>

<script setup lang="ts">
import { RecipeCategories, RecipeUnits, type Recipe } from '@/utils/types/recipe';
import { addInputRow } from '@/utils/global/list';
import InputField from '@/components/form/InputField.vue';
import InputList from '@/components/form/InputList.vue';
import SelectField from '@/components/form/SelectField.vue';
import TextArea from '@/components/form/TextArea.vue';
import UploadImage from '@/components/form/UploadImage.vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import Button from '../form/Button.vue';
import { ButtonType, ColAmount, ColorVariant } from '@/utils/types/enums';

const recipe = defineModel<Recipe>('recipe', { required: true });
const image = defineModel<File | string | null>('image', { required: true });
const save = defineEmits<{ save: [boolean] }>();
const errorMessage = defineModel<string>('errorMessage', { required: true });
</script>
