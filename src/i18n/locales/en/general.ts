const messages = {
  general: {
    ariaLabel: {
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      close: 'Close',
      deleteRow: 'Delete row',
      loading: 'Loading'
    },
    actions: {
      cancel: 'Cancel',
      delete: 'Delete'
    },
    pageTitles: {
      home: 'Home',
      recipes: 'My recipes',
      recipe: 'Recipe',
      createRecipe: 'Create recipe',
      editRecipe: 'Edit recipe',
      groceryList: 'Grocery list',
      profile: 'Profile',
      login: 'Login',
      notFound: 'Page not found'
    },
    recipe: {
      minutes: 'mins | min | mins',
      neverCooked: 'Never cooked',
      notFound: 'Recipe not found',
      notFoundSubtitle: 'Try one of your other delicious recipes',
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
      ingredients: 'Ingredients',
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
      placeholder: {
        amount: '2',
        unit: 'pc',
        ingredient: 'Spaghetti'
      },
      ariaLabel: {
        amount: 'Amount of the ingredient',
        unit: 'Unit of the ingredient',
        ingredient: 'Ingredient of the recipe'
      }
    },
    date: {
      today: 'Today',
      yesterday: 'Yesterday',
      daysAgo: 'days ago | day ago | days ago',
      weeksAgo: 'weeks ago | week ago | weeks ago',
      monthsAgo: 'months ago | month ago | months ago',
      yearsAgo: 'years ago | year ago | years ago'
    },
    errors: {
      emailAddressMissing: 'Email address is missing',
      emailAddressInvalid: 'Email address is invalid',
      emailExists: 'Email address already exists',
      invalidCredentials: 'Invalid credentials',
      userAlreadyExists: 'User already exists',
      userNotFound: 'User not found',
      passwordMissing: 'Password is missing',
      weakPassword:
        'Password is too weak. A password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      recipeNameMissing: 'Name is required',
      recipeCategoryMissing: 'Category is required',
      recipeDurationMissing: 'Duration is required',
      recipePortionsMissing: 'Portions is required',
      recipeRatingMissing: 'Rating is required',
      recipeIngredientsMissing: 'Ingredients is required',
      recipeInstructionsMissing: 'Instructions is required',
      unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?',
      unknown: 'An unknown error occurred. Please try again later'
    }
  }
};

export default messages;
