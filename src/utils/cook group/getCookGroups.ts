import { getAuth } from 'firebase/auth';
import {
  type QueryFilterConstraint,
  QueryCompositeFilterConstraint,
  type QueryNonFilterConstraint,
  where,
  or
} from 'firebase/firestore';
import { getData } from '../global/db';
import { sortCookGroups } from './sortCookGroup';
import type { CookGroup } from '../types/cookgroup';

/**
 * Get cook groups from the database
 * @returns {Promise<{cookGroups: CookGroup[]}>} An object containing the cook groups
 */
export async function getCookGroups(): Promise<{ cookGroups: CookGroup[] }> {
  let cookGroups: CookGroup[] = [];
  await getData('cookGroups', queryCookGroups(getAuth().currentUser?.uid || ''))
    .then((data) => {
      cookGroups = sortCookGroups(data as CookGroup[]);
    })
    .catch((error) => {
      console.error('Error getting cook groups from database:', error);
      cookGroups = [];
    });

  return cookGroups ? { cookGroups } : { cookGroups: [] };
}

/**
 * Get the query constraint for the cookGroups
 * @returns {QueryCompositeFilterConstraint, QueryNonFilterConstraint} An object containing the cook group filters and constraints
 */
export function queryCookGroups(userId: string): {
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
