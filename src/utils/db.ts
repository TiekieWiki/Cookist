import i18n from '@/i18n';
import {
  collection,
  addDoc,
  getDocs,
  query,
  QueryConstraint,
  deleteDoc,
  updateDoc,
  type DocumentData,
  QueryCompositeFilterConstraint,
  type QueryNonFilterConstraint
} from 'firebase/firestore';
import { DatabaseError } from '../utils/types/errors';
import db from './firebaseInit';

/**
 * Add data to a Firestore collection
 * @param table Firestore collection name
 * @param data Data to add
 */
export async function addData(table: string, data: any): Promise<void> {
  const docRef = await addDoc(collection(db, table), data);

  if (docRef === null) {
    throw new DatabaseError(i18n.global.t('database.errors.add'));
  }
}

/**
 * Get data from a Firestore collection
 * @param table Firestore collection name
 * @param tableQuery Firestore query constraint
 * @returns Firestore document data
 */
export async function getData(
  table: string,
  tableQuery?:
    | QueryConstraint
    | { filters: QueryCompositeFilterConstraint; constraints: QueryNonFilterConstraint[] }
): Promise<DocumentData[]> {
  let querySnapshot;
  if (!tableQuery) {
    querySnapshot = await getDocs(collection(db, table));
  } else if (tableQuery instanceof QueryConstraint) {
    querySnapshot = await getDocs(query(collection(db, table), tableQuery));
  } else {
    querySnapshot = await getDocs(
      query(collection(db, table), tableQuery.filters, ...tableQuery.constraints)
    );
  }

  if (!querySnapshot.empty) {
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } else {
    throw new DatabaseError(i18n.global.t('database.errors.get'));
  }
}

/**
 * Update data in a Firestore collection
 * @param table Firestore collection name
 * @param tableQuery Firestore query constraint
 * @param data Data to update
 */
export async function updateData(table: string, tableQuery: QueryConstraint, data: any) {
  const querySnapshot = await getDocs(query(collection(db, table), tableQuery));

  if (!querySnapshot.empty) {
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, data);
    });
  } else {
    throw new DatabaseError(i18n.global.t('database.errors.update'));
  }
}

/**
 * Delete data from a Firestore collection
 * @param table Firestore collection name
 * @param tableQuery Firestore query constraint
 */
export async function deleteData(table: string, tableQuery: QueryConstraint) {
  const querySnapshot = await getDocs(query(collection(db, table), tableQuery));

  if (!querySnapshot.empty) {
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } else {
    throw new DatabaseError(i18n.global.t('database.errors.delete'));
  }
}
