import { orderBy, QueryConstraint } from 'firebase/firestore';
import { OrderCategories } from '../types/order';

/**
 * Get the query constraint for the recipes
 * @param order Order category
 * @returns QueryConstraint
 */
export function getQuery(order: string): QueryConstraint {
  let query: QueryConstraint;
  switch (order) {
    case OrderCategories.lastEatenAsc:
      query = orderBy('lastEaten', 'asc');
      break;
    case OrderCategories.lastEatenDesc:
      query = orderBy('lastEaten', 'desc');
      break;
    case OrderCategories.ratingAsc:
      query = orderBy('rating', 'asc');
      break;
    case OrderCategories.ratingDesc:
      query = orderBy('rating', 'desc');
      break;
    case OrderCategories.durationAsc:
      query = orderBy('duration', 'asc');
      break;
    case OrderCategories.durationDesc:
      query = orderBy('duration', 'desc');
      break;
    case OrderCategories.nameAsc:
      query = orderBy('name', 'asc');
      break;
    case OrderCategories.nameDesc:
      query = orderBy('name', 'desc');
      break;
    default:
      query = orderBy('lastEaten', 'asc');
  }
  return query;
}
