import { where, orderBy, QueryConstraint, Timestamp } from 'firebase/firestore';
import { OrderCategories, type Filter } from '../types/orderFilter';

/**
 * Get the query constraint for the recipes
 * @param order Order category
 * @returns QueryConstraint
 */
export function getQuery(order: string, filter: Filter): QueryConstraint[] {
  const query: QueryConstraint[] = [];

  // Filter categories
  if (filter.categories.length > 0) {
    filter.categories.forEach((category) => {
      if (category.checked) {
        query.push(where('category', '==', category.name));
      }
    });
  }

  // Filter duration
  if (filter.durationMin > 0) {
    query.push(where('duration', '>=', filter.durationMin));
  }
  if (filter.durationMax < 10080) {
    query.push(where('duration', '<=', filter.durationMax));
  }

  // Filter rating
  if (filter.ratingMin > 0) {
    query.push(where('rating', '>=', filter.ratingMin));
  }
  if (filter.ratingMax < 5) {
    query.push(where('rating', '<=', filter.ratingMax));
  }

  // Filter last eaten
  if (filter.lastEatenMin > Timestamp.fromDate(new Date(0))) {
    query.push(where('lastEaten', '>=', filter.lastEatenMin));
  }
  if (filter.lastEatenMax < Timestamp.fromDate(new Date())) {
    query.push(where('lastEaten', '<=', filter.lastEatenMax));
  }

  // Filter ingredients
  if (filter.ingredients.length > 0) {
    filter.ingredients.forEach((ingredient) => {
      query.push(where('ingredients', 'array-contains', ingredient.name));
    });
  }

  // Order by the selected category
  switch (order) {
    case OrderCategories.lastEatenAsc:
      query.push(orderBy('lastEaten', 'asc'));
      break;
    case OrderCategories.lastEatenDesc:
      query.push(orderBy('lastEaten', 'desc'));
      break;
    case OrderCategories.ratingAsc:
      query.push(orderBy('rating', 'asc'));
      break;
    case OrderCategories.ratingDesc:
      query.push(orderBy('rating', 'desc'));
      break;
    case OrderCategories.durationAsc:
      query.push(orderBy('duration', 'asc'));
      break;
    case OrderCategories.durationDesc:
      query.push(orderBy('duration', 'desc'));
      break;
    case OrderCategories.nameAsc:
      query.push(orderBy('name', 'asc'));
      break;
    case OrderCategories.nameDesc:
      query.push(orderBy('name', 'desc'));
      break;
    default:
      query.push(orderBy('lastEaten', 'asc'));
  }

  return query;
}
