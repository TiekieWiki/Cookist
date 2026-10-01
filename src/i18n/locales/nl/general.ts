import type en from '../en/general';

const messages: typeof en = {
  general: {
    ariaLabel: {
      openMenu: 'Menu openen',
      closeMenu: 'Menu sluiten',
      close: 'Sluiten',
      deleteRow: 'Rij verwijderen',
      loading: 'Laden'
    },
    actions: {
      cancel: 'Annuleren',
      delete: 'Verwijderen'
    },
    pageTitles: {
      home: 'Home',
      recipes: 'Mijn recepten',
      recipe: 'Recept',
      createRecipe: 'Recept aanmaken',
      editRecipe: 'Recept bewerken',
      groceryList: 'Boodschappenlijst',
      profile: 'Profiel',
      login: 'Log in',
      notFound: 'Pagina niet gevonden'
    },
    recipe: {
      minutes: 'min | min | min',
      neverCooked: 'Nooit gekookt',
      notFound: 'Recept niet gevonden',
      notFoundSubtitle: 'Probeer een van je andere heerlijke recepten',
      category: 'Categorie',
      categories: {
        breakfast: 'Ontbijt',
        lunch: 'Lunch',
        dinner: 'Avondeten',
        snack: 'Snack',
        dessert: 'Dessert',
        drink: 'Drankje',
        other: 'Anders'
      },
      ingredients: 'Ingredienten',
      units: {
        pc: 'stuk',
        ml: 'ml',
        dl: 'dl',
        l: 'l',
        tsp: 'tl',
        tbsp: 'el',
        floz: 'fl oz',
        cup: 'cup',
        pt: 'pt',
        qt: 'qt',
        gal: 'gal',
        mg: 'mg',
        g: 'g',
        kg: 'kg',
        oz: 'oz',
        lb: 'lb'
      },
      placeholder: {
        amount: '2',
        unit: 'stuk',
        ingredient: 'Spaghetti'
      },
      ariaLabel: {
        amount: 'Hoeveelheid van het ingredient',
        unit: 'Eenheid van het ingredient',
        ingredient: 'Ingredient van het recept'
      }
    },
    date: {
      today: 'Vandaag',
      yesterday: 'Gisteren',
      daysAgo: 'dagen geleden | dag geleden | dagen geleden',
      weeksAgo: 'weken geleden | week geleden | weken geleden',
      monthsAgo: 'maanden geleden | maand geleden | maanden geleden',
      yearsAgo: 'jaar geleden | jaar geleden | jaar geleden'
    },
    errors: {
      emailAddressMissing: 'E-mailadres ontbreekt',
      emailAddressInvalid: 'E-mailadres is ongeldig',
      emailExists: 'E-mailadres bestaat al',
      invalidCredentials: 'Ongeldige inloggegevens',
      userAlreadyExists: 'Gebruiker bestaat al',
      userNotFound: 'Gebruiker niet gevonden',
      passwordMissing: 'Wachtwoord ontbreekt',
      weakPassword:
        'Wachtwoord is te zwak. Een wachtwoord moet minimaal 8 tekens lang zijn en ten minste één hoofdletter, één kleine letter, één cijfer en één speciaal teken bevatten',
      recipeNameMissing: 'Naam is verplicht',
      recipeCategoryMissing: 'Categorie is verplicht',
      recipeDurationMissing: 'Duur is verplicht',
      recipePortionsMissing: 'Porties is verplicht',
      recipeRatingMissing: 'Beoordeling is verplicht',
      recipeIngredientsMissing: 'Ingredienten is verplicht',
      recipeInstructionsMissing: 'Instructies is verplicht',
      unsavedChanges:
        'Er zijn niet opgeslagen wijzigingen. Weet je zeker dat je de pagina wilt verlaten?',
      unknown: 'Er is een onbekende fout opgetreden. Probeer het later opnieuw'
    }
  }
};

export default messages;
