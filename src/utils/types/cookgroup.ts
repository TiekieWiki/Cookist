export interface CookGroup {
  id: string;
  name: string;
  owner: string;
  personal: boolean;
  members?: Member[];
}

export interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  accepted: boolean;
}

export interface CookGroupRecipes {
  id: string;
  cookGroupId: string;
  recipeId: string;
  lastEaten: string;
}
