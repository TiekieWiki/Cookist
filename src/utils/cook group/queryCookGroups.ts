import {
  type QueryFilterConstraint,
  QueryCompositeFilterConstraint,
  type QueryNonFilterConstraint,
  where,
  or
} from 'firebase/firestore';

/**
 * Get the query constraint for the cookGroups
 * @returns {QueryCompositeFilterConstraint, QueryNonFilterConstraint} An object containing the cook group filters and constraints
 */
export function getQueryCookGroups(userId: string): {
  filters: QueryCompositeFilterConstraint;
  constraints: QueryNonFilterConstraint[];
} {
  const filters: QueryFilterConstraint[] = [];
  const constraints: QueryNonFilterConstraint[] = [];

  // Filter personal cook groups
  filters.push(where('owner', '==', userId));
  filters.push(where('members', 'array-contains', userId));

  return { filters: or(...filters), constraints: constraints };
}
