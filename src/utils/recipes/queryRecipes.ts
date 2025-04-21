import {
  where,
  orderBy,
  or,
  QueryFieldFilterConstraint,
  and,
  type QueryFilterConstraint,
  QueryCompositeFilterConstraint,
  type QueryNonFilterConstraint
} from 'firebase/firestore';
import { RecipeOrderCategories, type Filter } from '../types/orderFilter';
import type { CookGroupRecipes } from '../types/cookgroup';
import { getData } from '../db';

/**
 * Get the query constraint for the recipes
 * @param order Order category
 * @param filter Filter object
 * @returns QueryCompositeFilterConstraint, QueryConstraint
 */
export async function getQueryRecipes(
  order: string,
  filter: Filter,
  cookGroup: string
): Promise<{ filters: QueryCompositeFilterConstraint; constraints: QueryNonFilterConstraint[] }> {
  const filters: QueryFilterConstraint[] = [];
  const constraints: QueryNonFilterConstraint[] = [];

  // Get cook group recipes
  let cookGroupRecipes: CookGroupRecipes[] = [];
  if (cookGroup !== '') {
    cookGroupRecipes = (await getData(
      'cookGroupRecipes',
      where('cookGroupId', '==', cookGroup)
    )) as CookGroupRecipes[];
  }

  // Filter recipes
  const recipeQuery: QueryFieldFilterConstraint[] = [];
  if (cookGroupRecipes.length > 0) {
    cookGroupRecipes.forEach((cookGroupRecipe) => {
      if (cookGroupRecipe.recipeId !== '') {
        recipeQuery.push(where('id', '==', cookGroupRecipe.recipeId));
      }
    });
    filters.push(or(...recipeQuery));
  }

  // Filter name
  if (filter.name !== '') {
    filters.push(where('name', '>=', filter.name.toLowerCase()));
    filters.push(where('name', '<=', filter.name.toLowerCase() + '\uf8ff'));
  }

  // Filter categories
  const categoryQuery: QueryFieldFilterConstraint[] = [];
  if (filter.categories.length > 0) {
    filter.categories.forEach((category) => {
      if (category.checked) {
        categoryQuery.push(where('category', '==', category.name));
      }
    });
    filters.push(or(...categoryQuery));
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
    default:
      constraints.push(orderBy('name', 'asc'));
  }

  return { filters: and(...filters), constraints: constraints };
}
