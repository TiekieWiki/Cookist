import type { Timestamp } from 'firebase/firestore';

export enum RecipeOrderCategories {
  ratingDesc = 'ratingDesc',
  ratingAsc = 'ratingAsc',
  durationAsc = 'durationAsc',
  durationDesc = 'durationDesc',
  nameAsc = 'nameAsc',
  nameDesc = 'nameDesc'
}

export interface Filter {
  name: string;
  categories: Category[];
  durationMin: number;
  durationMax: number;
  ratingMin: number;
  ratingMax: number;
  ingredients: { name: string }[];
}

export interface Category {
  id: string;
  name: string;
  label: string;
  required: boolean;
  disabled: boolean;
  autocomplete: string;
  checked: boolean;
}
