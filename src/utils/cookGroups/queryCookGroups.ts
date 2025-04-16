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

/**
 * Get the query constraint for the cookGroups
 * @returns QueryCompositeFilterConstraint, QueryConstraint
 */
export function getQueryCookGroups(): {
  filters: QueryCompositeFilterConstraint;
  constraints: QueryNonFilterConstraint[];
} {
  const filters: QueryFilterConstraint[] = [];
  const constraints: QueryNonFilterConstraint[] = [];

  constraints.push(orderBy('name', 'asc'));

  return { filters: and(...filters), constraints: constraints };
}
