<template>
  <main class="modal">
    <article>
      <section class="header">
        <h2>{{ $t('editCookGroupPage.title') }}</h2>
        <h2>
          <font-awesome-icon @click="$emit('closePopUp')" :icon="['fas', 'xmark']" />
        </h2>
      </section>
      <input-field
        id="name"
        name="name"
        :label="$t('editCookGroupPage.name')"
        :placeholder="$t('editCookGroupPage.placeholder.name')"
        :ariaLabel="$t('editCookGroupPage.ariaLabel.name')"
        type="text"
        :disabled="cookGroup.personal"
        :required="true"
        v-model:input="cookGroup.name"
      />
      <input-list
        id="inviteeEmails"
        :label="$t('editCookGroupPage.inviteeEmails')"
        v-model:items="cookGroup.invitees"
        v-slot="{ index }"
      >
        <input-field
          :name="'invitee email ' + index"
          :placeholder="$t('editCookGroupPage.placeholder.inviteeEmails')"
          :ariaLabel="$t('editCookGroupPage.ariaLabel.inviteeEmails')"
          type="text"
          v-model:input="cookGroup.invitees[index]"
          @input="addInputRow(cookGroup.invitees, index, '')"
        />
      </input-list>
      <error-message v-model:message="errorMessage" />
      <input-list
        v-if="recipes.length > 0"
        id="cookGroupRecipes"
        :label="$t('editCookGroupPage.cookGroupRecipes')"
        :empty="true"
        v-model:items="recipes"
        v-slot="{ index }"
      >
        <input-field
          :name="'cookGroupRecipe ' + index"
          :ariaLabel="$t('editCookGroupPage.ariaLabel.cookGroupRecipe')"
          type="text"
          :disabled="true"
          v-model:input="recipes[index].name"
          @input="addInputRow(recipes, index, '')"
        />
      </input-list>
      <input-field
        id="searchRecipes"
        name="searchRecipes"
        :label="$t('editCookGroupPage.searchRecipes')"
        :placeholder="$t('editCookGroupPage.placeholder.searchRecipes')"
        :ariaLabel="$t('editCookGroupPage.ariaLabel.searchRecipes')"
        type="text"
        v-model:input="searchRecipeQuery"
      />
      <article
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        class="card searchRecipe"
        :id="recipe.id"
        @click="addRecipe(recipe)"
        tabindex="0"
      >
        <recipe-card :recipe="recipe" />
      </article>
      <section class="footer">
        <button @click="closePopUp" type="button">
          {{ $t('editCookGroupPage.cancel') }}
        </button>
        <button @click.prevent="saveCookGroup" type="submit">
          {{ $t('editCookGroupPage.save') }}
        </button>
      </section>
    </article>
  </main>
</template>

<script lang="ts" setup>
import InputField from '../form/InputField.vue';
import InputList from '../form/InputList.vue';
import ErrorMessage from '../form/ErrorMessage.vue';
import RecipeCard from '@/components/recipe/RecipeCard.vue';
import { addInputRow } from '@/utils/recipe/list';
import { useNewCookGroup } from '@/composables/useNewCookGroup';

const {
  cookGroup,
  recipes,
  errorMessage,
  searchRecipeQuery,
  filteredRecipes,
  addRecipe,
  saveCookGroup,
  closePopUp
} = useNewCookGroup();
</script>
