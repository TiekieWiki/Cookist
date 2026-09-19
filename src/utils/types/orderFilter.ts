import i18n from '@/i18n';
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
  categories: Category[];
  durationMin: number;
  durationMax: number;
  ratingMin: number;
  ratingMax: number;
  lastEatenMin: string;
  lastEatenMax: string;
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

export function emptyFilter(): Filter {
  return {
    name: '',
    categories: Object.values(RecipeCategories).map((category) => ({
      id: category,
      name: category,
      label: i18n.global.t(`editRecipePage.categories.${category}`),
      required: false,
      disabled: false,
      autocomplete: 'off',
      checked: false
    })),
    durationMin: 0,
    durationMax: 10080,
    ratingMin: 0,
    ratingMax: 5,
    lastEatenMin: new Date(0).toISOString().slice(0, 10),
    lastEatenMax: new Date('9999-12-31').toISOString().slice(0, 10),
    ingredients: [{ name: '' }]
  };
}
