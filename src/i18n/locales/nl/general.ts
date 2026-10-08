import type en from '../en/general';

const messages: typeof en = {
  general: {
    ariaLabel: {
      openMenu: 'Menu openen',
      closeMenu: 'Menu sluiten',
      close: 'Sluiten',
      deleteRow: 'Rij verwijderen',
      loading: 'Laden',
      toggleDropdown: 'Toggle dropdown menu'
    },
    actions: {
      cancel: 'Annuleren',
      delete: 'Verwijderen',
      tryAgain: 'Opnieuw proberen'
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
      actions: {
        getRecipes: 'Je recepten konden niet worden geladen',
        getRecipe: 'Dit recept kon niet worden geladen',
        setRecipe: 'Je recept kon niet worden opgeslagen',
        uploadRecipeImage: 'Je recept is opgeslagen, maar de foto kon niet worden geüpload',
        setLastEaten: 'Kon niet bijwerken wanneer je dit voor het laatst kookte',
        deleteRecipe: 'Dit recept kon niet worden verwijderd',
        getRecipeImages: "De foto's van de recepten konden niet worden geladen",
        getGroceryList: 'Je boodschappenlijst kon niet worden geladen',
        setGroceryList: 'Toevoegen aan je boodschappenlijst is mislukt',
        setGroceryListIngredient: 'Dit ingrediënt kon niet worden bijgewerkt',
        deleteGroceryListIngredient: 'Dit ingrediënt kon niet worden verwijderd',
        deleteGroceryList: 'Je boodschappenlijst kon niet worden geleegd',
        getProfile: 'Je voorkeuren konden niet worden geladen',
        setProfile: 'Je voorkeuren konden niet worden opgeslagen',
        setUsersLocalLanguage: 'Je taal kon niet worden ingesteld',
        getUser: 'Je account kon niet worden gecontroleerd',
        deleteUser: 'Je account kon niet worden verwijderd',
        login: 'Inloggen is mislukt',
        register: 'Je account kon niet worden aangemaakt',
        loadPage: 'Deze pagina kon niet worden geladen',
        unexpected: 'Er ging iets mis'
      },
      causes: {
        offline:
          'Het lijkt erop dat je offline bent. Controleer je verbinding en probeer het opnieuw.',
        network: 'De server is niet bereikbaar. Controleer je verbinding en probeer het opnieuw.',
        sessionExpired: 'Je sessie is verlopen. Log opnieuw in om verder te gaan.',
        permissionDenied: 'Je hebt geen toestemming om dit te doen.',
        notFound: 'Misschien is het verwijderd.',
        rateLimited: 'Te veel pogingen. Wacht even en probeer het opnieuw.',
        invalidCredentials: 'Het e-mailadres of wachtwoord klopt niet.',
        emailExists: 'Er bestaat al een account met dit e-mailadres. Log in plaats daarvan in.',
        emailNotConfirmed: 'Bevestig eerst je e-mailadres. Kijk in je inbox voor de link.',
        emailAddressInvalid: 'Dit e-mailadres is niet geldig.',
        fileTooLarge: 'De foto is te groot. Kies een kleinere foto.',
        invalidFileType:
          'Dit bestandstype wordt niet ondersteund. Kies een JPG-, PNG- of WebP-foto.',
        unknown: 'Probeer het opnieuw. Blijft het misgaan, probeer het dan later nog eens.',
        weakPassword:
          'Wachtwoord is te zwak. Een wachtwoord moet minimaal 8 tekens lang zijn en ten minste één hoofdletter, één kleine letter, één cijfer en één speciaal teken bevatten'
      },
      unsavedChanges:
        'Er zijn niet opgeslagen wijzigingen. Weet je zeker dat je de pagina wilt verlaten?'
    }
  }
};

export default messages;
