export interface CookGroup {
  id: string;
  name: string;
  owner: string;
  personal: boolean;
  members: Member[];
}

export interface Member {
  userId: string;
  email: string;
}

export interface CookGroupRecipes {
  id: string;
  cookGroupId: string;
  recipeId: string;
  lastEaten: string;
}

export function emptyCookGroupMembers(): CookGroup {
  return {
    id: '',
    name: '',
    owner: '',
    personal: true,
    members: [{ userId: '', email: '' }]
  };
}
