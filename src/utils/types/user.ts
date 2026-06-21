import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string | undefined;
  language: 'nl' | 'en';
  colorScheme: 'light' | 'dark';
  handedness?: 'left' | 'right' | 'ambidextrous';
  recipes: UserRecipe[];
}

interface UserRecipe {
  recipeId: string;
  lastEaten: Timestamp;
}
