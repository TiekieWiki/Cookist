import {
  where,
  orderBy,
  or,
  QueryFieldFilterConstraint,
  and,
  type QueryFilterConstraint,
  QueryCompositeFilterConstraint,
  type QueryNonFilterConstraint,
  Timestamp
} from 'firebase/firestore';
import { RecipeOrderCategories, type Filter } from '../types/orderFilter';
import type { CookGroupRecipe } from '../types/cookgroup';
import { getData } from '../db';

/**
 * Get the query constraint for the recipes
 * @param order Order category
 * @param filter Filter object
 * @returns {Promise<{CookGroupRecipe[], string[], { QueryCompositeFilterConstraint, QueryNonFilterConstraint }}>} - A promise that resolves to an object containing the cook group recipes, recipe last eaten order, and recipe filter
 */
export async function getQueryRecipes(
  order: string,
  filter: Filter,
  cookGroup: string
): Promise<{
  cookGroupRecipes: CookGroupRecipe[];
  recipeLastEatenOrder: string[];
  recipeFilter: {
    filters: QueryCompositeFilterConstraint;
    constraints: QueryNonFilterConstraint[];
  };
}> {
  const filters: QueryFilterConstraint[] = [];
  const constraints: QueryNonFilterConstraint[] = [];

  // Filter last eaten
  const cookGroupFilter: QueryFieldFilterConstraint[] = [];
  if (Timestamp.fromMillis(Date.parse(filter.lastEatenMin)) > new Timestamp(0, 0)) {
    cookGroupFilter.push(
      where('lastEaten', '>=', Timestamp.fromMillis(Date.parse(filter.lastEatenMin)))
    );
  }
  if (
    Timestamp.fromMillis(Date.parse(filter.lastEatenMax)) <
    Timestamp.fromDate(new Date('9999-12-31'))
  ) {
    cookGroupFilter.push(
      where('lastEaten', '<=', Timestamp.fromMillis(Date.parse(filter.lastEatenMax.valueOf())))
    );
  }

  // Order last eaten
  const cookGroupConstraints: QueryNonFilterConstraint[] = [];
  switch (order) {
    case RecipeOrderCategories.lastEatenAsc:
      cookGroupConstraints.push(orderBy('lastEaten', 'asc'));
      break;
    case RecipeOrderCategories.lastEatenDesc:
      cookGroupConstraints.push(orderBy('lastEaten', 'desc'));
      break;
  }

  // Get cook group recipes
  let cookGroupRecipes: CookGroupRecipe[] = [];
  if (cookGroup !== '') {
    cookGroupFilter.push(where('cookGroupId', '==', cookGroup));
    cookGroupRecipes = (await getData('cookGroupRecipes', {
      filters: and(...cookGroupFilter),
      constraints: cookGroupConstraints
    })) as CookGroupRecipe[];
  }

  // Create last eaten filter if selected by user
  const recipeLastEatenOrder: string[] = [];
  if (cookGroupConstraints.length > 0) {
    cookGroupRecipes.forEach((cookGroupRecipe) => {
      if (cookGroupRecipe.recipeId !== '') {
        recipeLastEatenOrder.push(cookGroupRecipe.recipeId);
      }
    });
  }

  // Filter recipes
  const recipeFilter: QueryFieldFilterConstraint[] = [];
  if (cookGroupRecipes.length > 0) {
    cookGroupRecipes.forEach((cookGroupRecipe) => {
      if (cookGroupRecipe.recipeId !== '') {
        recipeFilter.push(where('id', '==', cookGroupRecipe.recipeId));
      }
    });
    filters.push(or(...recipeFilter));
  }

  // Filter name
  if (filter.name !== '') {
    filters.push(where('name', '>=', filter.name.toLowerCase()));
    filters.push(where('name', '<=', filter.name.toLowerCase() + '\uf8ff'));
  }

  // Filter categories
  const categoryFilter: QueryFieldFilterConstraint[] = [];
  if (filter.categories.length > 0) {
    filter.categories.forEach((category) => {
      if (category.checked) {
        categoryFilter.push(where('category', '==', category.name));
      }
    });
    filters.push(or(...categoryFilter));
  }

  // Filter duration
  if (filter.durationMin > 0) {
    filters.push(where('duration', '>=', filter.durationMin));
  }
  if (filter.durationMax < 10080) {
    filters.push(where('duration', '<=', filter.durationMax));
  }

  // Filter rating
  if (filter.ratingMin > 0) {
    filters.push(where('rating', '>=', filter.ratingMin));
  }
  if (filter.ratingMax < 5) {
    filters.push(where('rating', '<=', filter.ratingMax));
  }

  // Filter ingredients
  const ingredients = filter.ingredients
    .filter((ingredient) => ingredient.name !== '')
    .map((ingredient) => ingredient.name);
  if (ingredients.length > 0) {
    filters.push(where('filterIngredients', 'array-contains-any', ingredients));
  }

  // Order by the selected category
  switch (order) {
    case RecipeOrderCategories.ratingAsc:
      constraints.push(orderBy('rating', 'asc'));
      break;
    case RecipeOrderCategories.ratingDesc:
      constraints.push(orderBy('rating', 'desc'));
      break;
    case RecipeOrderCategories.durationAsc:
      constraints.push(orderBy('duration', 'asc'));
      break;
    case RecipeOrderCategories.durationDesc:
      constraints.push(orderBy('duration', 'desc'));
      break;
    case RecipeOrderCategories.nameAsc:
      constraints.push(orderBy('name', 'asc'));
      break;
    case RecipeOrderCategories.nameDesc:
      constraints.push(orderBy('name', 'desc'));
      break;
  }

  return {
    cookGroupRecipes: cookGroupRecipes,
    recipeLastEatenOrder: recipeLastEatenOrder,
    recipeFilter: { filters: and(...filters), constraints: constraints }
  };
}
