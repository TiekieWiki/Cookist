import type en from '../en/groceryList';

const messages: typeof en = {
  groceryListPage: {
    noItems: 'Nog niks op de lijst',
    itemsToBuy: 'items om te kopen | item om te kopen | items om te kopen',
    emptyGroceryList: 'Boodschappenlijst legen',
    confirmEmpty:
      'Weet je zeker dat je de boodschappenlijst wilt legen? Dit kan niet ongedaan worden gemaakt.',
    empty: 'Legen',
    clearAll: 'Alles wissen',
    emptyBasket: 'Je lijst is leeg',
    emptyBasketSubtitle:
      'Open een recept en klik "Toevoegen aan boodschappenlijst" — alles komt hier terecht als een nette lijst.',
    browseRecipes: 'Recepten bekijken',
    addIngredient: 'Ingredient toevoegen',
    ariaLabel: {
      deleteIngredient: '{name} verwijderen'
    }
  }
};

export default messages;
