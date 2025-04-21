import type { Timestamp } from 'firebase/firestore';

export interface CookGroup {
  id: string;
  name: string;
  owner: string;
  personal: boolean;
  invitees: string[];
  members: string[];
}
export interface CookGroupRecipes {
  id: string;
  cookGroupId: string;
  recipeId: string;
  lastEaten: Timestamp | undefined;
}

export function emptyCookGroup(): CookGroup {
  return {
    id: '',
    name: '',
    owner: '',
    personal: true,
    invitees: [''],
    members: []
  };
}

export function emptyCookGroupRecipes(): CookGroupRecipes {
  return {
    id: '',
    cookGroupId: '',
    recipeId: '',
    lastEaten: undefined
  };
}
