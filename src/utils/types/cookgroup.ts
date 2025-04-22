import { Timestamp } from 'firebase/firestore';

export interface CookGroup {
  id: string;
  name: string;
  owner: string;
  personal: boolean;
  invitees: string[];
  members: string[];
}
export interface CookGroupRecipe {
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

export function emptyCookGroupRecipe(): CookGroupRecipe {
  return {
    id: '',
    cookGroupId: '',
    recipeId: '',
    lastEaten: new Timestamp(0, 0)
  };
}
