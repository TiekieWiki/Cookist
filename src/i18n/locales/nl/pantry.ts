import type en from '../en/pantry';

const messages: typeof en = {
  pantryPage: {
    noRecipes: 'Nog niks op de lijst',
    recipesToCook: 'recepten om te koken | recept om te koken | recepten om te koken',
    emptyPantry: 'Voorraadkast legen',
    confirmEmpty:
      'Weet je zeker dat je de voorraadkast wilt legen? Dit kan niet ongedaan worden gemaakt.',
    empty: 'Legen',
    clearAll: 'Alles wissen',
    emptyPantryTitle: 'Je voorraadkast is leeg',
    emptyPantrySubtitle:
      'Open een recept en klik "Toevoegen aan boodschappenlijst" — het recept komt hier terecht voor een lijst van recepten.',
    browseRecipes: 'Recepten bekijken',
    cookedToday: 'Vandaag gekookt',
    ariaLabel: {
      cookedToday: '{name} markeren als vandaag gekookt',
      removeRecipe: '{name} uit je voorraadkast verwijderen'
    }
  }
};

export default messages;
