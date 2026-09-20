import { RecipeCategories } from './recipe';

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
  category: RecipeCategories | null;
  durationMin: number;
  durationMax: number;
  ratingMin: number;
  ratingMax: number;
  lastEatenMin: string;
  lastEatenMax: string;
  ingredients: { name: string }[];
}

export function emptyFilter(): Filter {
  return {
    name: '',
    category: null,
    durationMin: 0,
    durationMax: 10080,
    ratingMin: 0,
    ratingMax: 5,
    lastEatenMin: new Date(0).toISOString().slice(0, 10),
    lastEatenMax: new Date('9999-12-31').toISOString().slice(0, 10),
    ingredients: [{ name: '' }]
  };
}
