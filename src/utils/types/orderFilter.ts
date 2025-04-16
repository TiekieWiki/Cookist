import type { Timestamp } from 'firebase/firestore';

export enum RecipeOrderCategories {
  lastEatenAsc = 'lastEatenAsc',
  lastEatenDesc = 'lastEatenDesc',
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
  lastEatenMin: Timestamp;
  lastEatenMax: Timestamp;
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
