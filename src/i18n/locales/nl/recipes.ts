import type en from '../en/recipes';

const messages: typeof en = {
  recipesPage: {
    totalRecipes:
      '{count} geweldige recepten | {count} geweldig recept | {count} geweldige recepten',
    newRecipe: 'Nieuw',
    filters: 'Filters',
    reset: 'Reset',
    orders: {
      lastEatenAsc: 'Laatst gegeten (oud-nieuw)',
      lastEatenDesc: 'Laatst gegeten (nieuw-oud)',
      ratingAsc: 'Beoordeling (1-5)',
      ratingDesc: 'Beoordeling (5-1)',
      durationAsc: 'Duur (kort-lang)',
      durationDesc: 'Duur (lang-kort)',
      nameAsc: 'Naam (A-Z)',
      nameDesc: 'Naam (Z-A)'
    },
    duration: 'Duur',
    rating: 'Beoordeling',
    lastEaten: 'Laatst gegeten',
    noRecipes: 'Geen recepten gevonden',
    noRecipesSubtitle: 'Tijd om wat lekkers toe te voegen',
    placeholder: {
      search: 'Zoek recepten',
      order: 'Laatst gegeten (oud-nieuw)'
    },
    ariaLabel: {
      search: 'Zoeken',
      order: 'Recepten sorteren op',
      durationMin: 'Minimum duur van het recept',
      durationMax: 'Maximum duur van het recept',
      ratingMin: 'Minimum beoordeling van het recept',
      ratingMax: 'Maximum beoordeling van het recept',
      lastEatenMin: 'Minimum laatst gegeten van het recept',
      lastEatenMax: 'Maximum laatst gegeten van het recept',
      closeFilters: 'Filters sluiten'
    }
  }
};

export default messages;
