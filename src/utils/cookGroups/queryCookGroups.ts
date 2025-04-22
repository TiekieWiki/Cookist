import {
  orderBy,
  type QueryFilterConstraint,
  QueryCompositeFilterConstraint,
  type QueryNonFilterConstraint,
  where,
  or
} from 'firebase/firestore';

/**
 * Get the query constraint for the cookGroups
 * @returns QueryCompositeFilterConstraint, QueryConstraint
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
