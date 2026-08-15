import type { TranslationSchema } from './en';

export const nl: TranslationSchema = {
  homePage: {
    title: 'Home',
    banner: {
      pill: 'Jouw kookboek, met een geheugen',
      title: 'Kook de recepten die je vergeten was dat je ze lekker vond.',
      subtitle: 'Cookist houdt je recepten bij en registreert wanneer je ze voor het laatst hebt gemaakt — zodat de goede recepten weer boven komen drijven in plaats van stof te verzamelen.',
      browseRecipes: 'Bekijk mijn recepten',
      addRecipe: 'Voeg recept toe',
      longestUntouched: 'Lang niet aangeraakt',
      recipeTitle: 'Pompoen spruitjes salade',
      lastEaten: '8 maanden'
    },
    actionPoints: {
      lastEaten: {
        title: 'Gesorteerd op vergeten',
        subtitle: 'Elk recept draagt ​​een stille stofmeter met zich mee. Hoe langer geleden je het hebt bereid, des te hoger de meter oploopt.'
      },
      nutrition: {
        title: 'Voedingswaarden — binnenkort',
        subtitle: 'Voedingswaarden per portie berekend op basis van je ingrediëntenlijst – geen spreadsheet nodig.'
      },
      recipeMatcher: {
        title: 'Recept matcher — binnenkort',
        subtitle: 'Twee personen, één stapel recepten. Swipe tot jullie allebei bij hetzelfde recept uitkomen.'
      }
    }
  },
  loginPage: {
    title: 'Log in',
    banner: {
      title: '"We maakten dit elke week. Toen vergaten we het simpelweg."',
      subtitle: 'Cookist bestaat zodat dat nooit gebeurd.',
      quote: 'Recepten, onthouden.'
    },
    login: {
      title: 'Welkom terug',
      subtitle: 'Ga verder waar je gebleven was.',
      toggle: 'Log in',
      button: 'Log in'
    },
    register: {
      title: 'Doe alsof je thuis bent',
      subtitle: 'Een paar seconden, en begin dan met het toevoegen van recepten.',
      toggle: 'Registreer',
      button: 'Maak account aan'
    },
    email: 'E-mail',
    password: 'Wachtwoord',
    placeholder: {
      email: "john.doe{'@'}gmail.com",
      password: '********'
    },
    ariaLabel: {
      email: 'Email',
      password: 'Wachtwoord',
    },
  },
  profilePage: {
    title: 'Profiel',
    account: 'Account',
    logout: 'Log uit',
    settings: 'Instellingen',
    languages: {
      en: 'Engels',
      nl: 'Nederlands'
    },
    colorSchemes: {
      light: 'Licht',
      dark: 'Donker'
    },
    handedness: {
      right: 'Rechtshandig',
      left: 'Linkshandig',
      ambidextrous: 'Tweehandig'
    },
    save: 'Opslaan',
    saveSuccess: 'Instellingen opgeslagen',
    deleteAccount: 'Account verwijderen',
    confirmDelete:
      'Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.',
    cancel: 'Annuleren',
    delete: 'Verwijderen',
    ariaLabel: {
      userEmail: 'Gebruiker e-mail',
      language: 'Taal',
      colorScheme: 'Kleurenschema',
      handedness: 'Handigheid'
    }
  },
  recipesPage: {
    title: 'Recepten',
    filter: 'Filter',
    order: 'Sorteer',
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
    durationMin: 'Minimum duur',
    durationMax: 'Maximum duur',
    ratingMin: 'Minimum beoordeling',
    ratingMax: 'Maximum beoordeling',
    lastEatenMin: 'Minimum laatst gegeten',
    lastEatenMax: 'Maximum laatst gegeten',
    noRecipes: 'Geen recepten gevonden',
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
      lastEatenMax: 'Maximum laatst gegeten van het recept'
    }
  },
  recipePage: {
    title: 'Recept',
    ingredients: 'Ingrediënten',
    portions: 'porties | portie | porties',
    addToGroceryList: 'Toevoegen aan boodschappenlijst',
    instructions: 'Instructies',
    keepOnScreen: 'Scherm aanhouden',
    eatenToday: 'Vandaag gegeten',
    deleteRecipe: 'Verwijder recept',
    confirmDelete: 'Weet je zeker dat je dit recept wilt verwijderen?',
    cancel: 'Annuleren',
    delete: 'Verwijderen',
    recipeNotFound: 'Recept niet gevonden',
    placeholder: {
      hours: "uu",
      minutes: "mm",
      seconds: "ss",
    },
    ariaLabel: {
      hours: "Uren",
      minutes: "Minuten",
      seconds: "Seconden",
    }
  },
  createRecipePage: {
    title: 'Recept aanmaken',
  },
  editRecipePage: {
    title: 'Recept bewerken',
    name: 'Naam',
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
    duration: 'Duur (min)',
    portions: 'Porties',
    rating: 'Beoordeling',
    image: 'Afbeelding',
    ingredients: 'Ingredienten',
    ingredient: 'Ingredient',
    amount: 'Hoeveelheid',
    unit: 'Eenheid',
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
    instructions: 'Instructies',
    instruction: 'Instructie',
    notes: 'Aantekeningen',
    save: 'Opslaan',
    recipeNotFound: 'Recept niet gevonden',
    placeholder: {
      name: 'Pasta Carbonara',
      category: 'Avondeten',
      duration: '30',
      portions: '4',
      rating: '5',
      amount: '2',
      unit: 'stuk',
      ingredient: 'Spaghetti',
      instruction: 'Kook de spaghetti',
      notes: 'Dit is een familie recept',
      image: 'Afbeelding'
    },
    ariaLabel: {
      name: 'Naam van het recept',
      category: 'Categorie van het recept',
      duration: 'Duur van het recept',
      portions: 'Aantal porties van het recept',
      rating: 'Beoordeling van het recept',
      image: 'Afbeelding van het recept',
      ingredients: 'Ingredienten van het recept',
      ingredient: 'Ingredient van het recept',
      amount: 'Hoeveelheid van het ingredient',
      unit: 'Eenheid van het ingredient',
      instructions: 'Instructies van het recept',
      instruction: 'Instructie van het recept',
      notes: 'Aantekeningen over het recept'
    },
    alt: {
      previewImage: 'Voorbeeld van de receptafbeelding'
    },
  },
  groceryListPage: {
    title: 'Boodschappenlijst',
    addItem: 'Toevoegen',
    noItems: 'Geen items in de boodschappenlijst',
    emptyGroceryList: 'Boodschappenlijst legen',
    confirmEmpty:
      'Weet je zeker dat je de boodschappenlijst wilt legen? Dit kan niet ongedaan worden gemaakt.',
    cancel: 'Annuleren',
    empty: 'Legen',
    errors: {
      invalidIngredient:
        'Ongeldig ingrediënt. Zorg ervoor dat alle velden zijn ingevuld en de hoeveelheid groter is dan 0.'
    }
  },
  notFoundPage: {
    title: 'Pagina niet gevonden',
    description: 'De pagina die je zoekt bestaat niet.'
  },
  database: {
    errors: {
      add: 'Er is een fout opgetreden bij het toevoegen van de data',
      get: 'Er is een fout opgetreden bij het ophalen van de data',
      update: 'Er is een fout opgetreden bij het updaten van de data',
      delete: 'Er is een fout opgetreden bij het verwijderen van de data'
    }
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
};
