import {
  where,
  orderBy,
  Timestamp,
  or,
  QueryFieldFilterConstraint,
  and,
  type QueryFilterConstraint,
  QueryCompositeFilterConstraint,
  type QueryNonFilterConstraint
} from 'firebase/firestore';
import { OrderCategories, type Filter } from '../types/orderFilter';

/**
 * Get the query constraint for the recipes
 * @param order Order category
 * @returns QueryConstraint
 */
export function getQuery(
  order: string,
  filter: Filter
): { filters: QueryCompositeFilterConstraint; constraints: QueryNonFilterConstraint[] } {
  const filters: QueryFilterConstraint[] = [];
  const constraints: QueryNonFilterConstraint[] = [];

  // Filter name
  if (filter.name !== '') {
    filters.push(where('name', '>=', filter.name.toLowerCase()));
    filters.push(where('name', '<=', filter.name.toLowerCase() + '\uf8ff'));
  }

  // Filter categories
  const orQuery: QueryFieldFilterConstraint[] = [];
  if (filter.categories.length > 0) {
    filter.categories.forEach((category) => {
      if (category.checked) {
        orQuery.push(where('category', '==', category.name));
      }
    });
    filters.push(or(...orQuery));
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

  // Filter last eaten
  if (filter.lastEatenMin > Timestamp.fromDate(new Date(0))) {
    filters.push(where('lastEaten', '>=', new Date(filter.lastEatenMin.valueOf())));
  }
  if (filter.lastEatenMax < Timestamp.fromDate(new Date('9999-12-31'))) {
    filters.push(where('lastEaten', '<=', new Date(filter.lastEatenMax.valueOf())));
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
    case OrderCategories.lastEatenAsc:
      constraints.push(orderBy('lastEaten', 'asc'));
      break;
    case OrderCategories.lastEatenDesc:
      constraints.push(orderBy('lastEaten', 'desc'));
      break;
    case OrderCategories.ratingAsc:
      constraints.push(orderBy('rating', 'asc'));
      break;
    case OrderCategories.ratingDesc:
      constraints.push(orderBy('rating', 'desc'));
      break;
    case OrderCategories.durationAsc:
      constraints.push(orderBy('duration', 'asc'));
      break;
    case OrderCategories.durationDesc:
      constraints.push(orderBy('duration', 'desc'));
      break;
    case OrderCategories.nameAsc:
      constraints.push(orderBy('name', 'asc'));
      break;
    case OrderCategories.nameDesc:
      constraints.push(orderBy('name', 'desc'));
      break;
    default:
      constraints.push(orderBy('lastEaten', 'asc'));
  }

  return { filters: and(...filters), constraints: constraints };
}
