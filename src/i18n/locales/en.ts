export const en = {
  homePage: {
    title: 'Home',
    banner1: 'All your favourite recipes in one place',
    banner2: 'Never forget a recipe with the last eaten function',
    banner3: 'Share your recipes others'
  },
  registerPage: {
    title: 'Register',
    alreadyAccount: 'Already have an account?',
    signIn: 'Sign in'
  },
  loginPage: {
    title: 'Login',
    login: 'Log in',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    placeholder: {
      email: "john.doe{'@'}gmail.com",
      password: '********'
    },
    ariaLabel: {
      emailLogin: 'Email for logging in',
      passwordLogin: 'Password for logging in',
      emailRegister: 'Email for registering',
      passwordRegister: 'Password for registering'
    }
  },
  profilePage: {
    title: 'Profile',
    account: 'Account',
    logout: 'Log out',
    settings: 'Settings',
    languages: {
      en: 'English',
      nl: 'Dutch'
    },
    colorSchemes: {
      light: 'Light',
      dark: 'Dark'
    },
    handedness: {
      right: 'Right-handed',
      left: 'Left-handed',
      ambidextrous: 'Ambidextrous'
    },
    save: 'Save',
    saveSuccess: 'Settings saved successfully',
    deleteAccount: 'Delete account',
    confirmDelete: 'Are you sure you want to delete your account? This cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete',
    ariaLabel: {
      userEmail: 'User email',
      language: 'Language',
      colorScheme: 'Color scheme',
      handedness: 'Handedness'
    }
  },
  recipesPage: {
    title: 'Recipes',
    filter: 'Filter',
    order: 'Order',
    orders: {
      lastEatenAsc: 'Last eaten (old-new)',
      lastEatenDesc: 'Last eaten (new-old)',
      ratingAsc: 'Rating (1-5)',
      ratingDesc: 'Rating (5-1)',
      durationAsc: 'Duration (short-long)',
      durationDesc: 'Duration (long-short)',
      nameAsc: 'Name (A-Z)',
      nameDesc: 'Name (Z-A)'
    },
    durationMin: 'Minimum duration',
    durationMax: 'Maximum duration',
    ratingMin: 'Minimum rating',
    ratingMax: 'Maximum rating',
    lastEatenMin: 'Minimum last eaten',
    lastEatenMax: 'Maximum last eaten',
    noRecipes: 'No recipes found',
    placeholder: {
      search: 'Search recipes',
      order: 'Last eaten (old-new)'
    },
    ariaLabel: {
      search: 'Search',
      order: 'Order recipes by',
      durationMin: 'Minimum duration of the recipe',
      durationMax: 'Maximum duration of the recipe',
      ratingMin: 'Minimum rating of the recipe',
      ratingMax: 'Maximum rating of the recipe',
      lastEatenMin: 'Minimum last eaten of the recipe',
      lastEatenMax: 'Maximum last eaten of the recipe'
    }
  },
  recipePage: {
    title: 'Recipe',
    ingredients: 'Ingredients',
    portions: 'portions | portion | portions',
    addToGroceryList: 'Add to grocery list',
    instructions: 'Instructions',
    keepOnScreen: 'Keep screen on',
    eatenToday: 'Eaten today',
    deleteRecipe: 'Delete recipe',
    confirmDelete: 'Are you sure you want to delete this recipe?',
    cancel: 'Cancel',
    delete: 'Delete',
    recipeNotFound: 'Recipe not found'
  },
  editRecipePage: {
    title: 'Edit recipe',
    name: 'Name',
    category: 'Category',
    categories: {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack',
      dessert: 'Dessert',
      drink: 'Drink',
      other: 'Other'
    },
    duration: 'Duration (min)',
    portions: 'Portions',
    rating: 'Rating',
    image: 'Picture',
    ingredients: 'Ingredients',
    ingredient: 'Ingredient',
    amount: 'Amount',
    unit: 'Unit',
    units: {
      pc: 'piece',
      ml: 'ml',
      dl: 'dl',
      l: 'l',
      tsp: 'tsp',
      tbsp: 'tbsp',
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
    instructions: 'Instructions',
    instruction: 'Instruction',
    notes: 'Notes',
    save: 'Save',
    recipeNotFound: 'Recipe not found',
    placeholder: {
      name: 'Pasta Carbonara',
      category: 'Dinner',
      duration: '30',
      portions: '4',
      rating: '5',
      amount: '2',
      unit: 'pc',
      ingredient: 'Spaghetti',
      instruction: 'Boil the spaghetti',
      notes: 'This is a family recipe',
      image: 'Image'
    },
    ariaLabel: {
      name: 'Name of the recipe',
      category: 'Category of the recipe',
      duration: 'Duration of the recipe',
      portions: 'Number of portions of the recipe',
      rating: 'Rating of the recipe',
      image: 'Picture of the recipe',
      ingredients: 'Ingredients of the recipe',
      ingredient: 'Ingredient of the recipe',
      amount: 'Amount of the ingredient',
      unit: 'Unit of the ingredient',
      instructions: 'Instructions of the recipe',
      instruction: 'Instruction of the recipe',
      notes: 'Notes about the recipe'
    },
    alt: {
      previewImage: 'Preview of the recipe image'
    },
    errors: {
      name: 'Name is required',
      category: 'Category is required',
      duration: 'Duration is required',
      portions: 'Portions is required',
      rating: 'Rating is required',
      ingredients: 'Ingredients is required',
      instructions: 'Instructions is required',
      save: 'Something went wrong. Please try again.',
      unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?'
    }
  },
  groceryListPage: {
    title: 'Grocery list',
    addItem: 'Add',
    noItems: 'No items in the grocery list',
    emptyGroceryList: 'Empty grocery list',
    confirmEmpty: 'Are you sure you want to empty the grocery list? This cannot be undone.',
    cancel: 'Cancel',
    empty: 'Empty',
    errors: {
      invalidIngredient:
        'Invalid ingredient. Make sure all fields are filled and the amount is greater than 0.'
    }
  },
  notFoundPage: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist.'
  },
  database: {
    errors: {
      add: 'An error occurred while adding the data',
      get: 'An error occurred while retrieving the data',
      update: 'An error occurred while updating the data',
      delete: 'An error occurred while deleting the data'
    }
  }
};

export type TranslationSchema = typeof en;
