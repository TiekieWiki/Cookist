import { RecipeCategories } from './recipe';

export enum OrderBy {
  lastEaten = 'last_eaten',
  rating = 'rating',
  duration = 'duration',
  name = 'name',
}

export enum OrderDirection {
  asc = 'asc',
  desc = 'desc',
}

export enum RecipeOrderCategories {
  lastEatenAsc = 'lastEatenAsc',
  lastEatenDesc = 'lastEatenDesc',
  ratingAsc = 'ratingAsc',
  ratingDesc = 'ratingDesc',
  durationAsc = 'durationAsc',
  durationDesc = 'durationDesc',
  nameAsc = 'nameAsc',
  nameDesc = 'nameDesc'
}

export interface RecipeOrder {
  value: RecipeOrderCategories;
  orderBy: OrderBy;
  orderDirection: OrderDirection;
}

export interface Filter {
  name: string;
  category: RecipeCategories | null;
  durationMin: number | null;
  durationMax: number | null;
  ratingMin: number | null;
  ratingMax: number | null;
  lastEatenMin: string | null;
  lastEatenMax: string | null;
  ingredients: { name: string }[];
}

export function emptyFilter(): Filter {
  return {
    name: '',
    category: null,
    durationMin: null,
    durationMax: null,
    ratingMin: null,
    ratingMax: null,
    lastEatenMin: null,
    lastEatenMax: null,
    ingredients: [{ name: '' }]
  };
}
