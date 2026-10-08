const messages = {
  general: {
    ariaLabel: {
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      close: 'Close',
      deleteRow: 'Delete row',
      loading: 'Loading',
      toggleDropdown: 'Toggle dropdown menu'
    },
    actions: {
      cancel: 'Cancel',
      delete: 'Delete',
      tryAgain: 'Try again'
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
      actions: {
        getRecipes: "Couldn't load your recipes",
        getRecipe: "Couldn't load this recipe",
        setRecipe: "Couldn't save your recipe",
        uploadRecipeImage: "Your recipe is saved, but the picture couldn't be uploaded",
        setLastEaten: "Couldn't update when you last cooked this",
        deleteRecipe: "Couldn't delete this recipe",
        getRecipeImages: "Couldn't load the recipe pictures",
        getGroceryList: "Couldn't load your grocery list",
        setGroceryList: "Couldn't add to your grocery list",
        setGroceryListIngredient: "Couldn't update this ingredient",
        deleteGroceryListIngredient: "Couldn't remove this ingredient",
        deleteGroceryList: "Couldn't empty your grocery list",
        getProfile: "Couldn't load your preferences",
        setProfile: "Couldn't save your preferences",
        setUsersLocalLanguage: "Couldn't set your language",
        getUser: "Couldn't check your account",
        deleteUser: "Couldn't delete your account",
        login: "Couldn't sign you in",
        register: "Couldn't create your account",
        loadPage: "Couldn't load this page",
        unexpected: 'Something went wrong'
      },
      causes: {
        offline: 'You seem to be offline. Check your connection and try again.',
        network: "We couldn't reach the server. Check your connection and try again.",
        sessionExpired: 'Your session has expired. Sign in again to continue.',
        permissionDenied: "You don't have permission to do this.",
        notFound: 'It may have been deleted.',
        rateLimited: 'Too many attempts. Wait a moment and try again.',
        invalidCredentials: 'The email address or password is incorrect.',
        emailExists: "There's already an account with this email address. Sign in instead.",
        emailNotConfirmed: 'Confirm your email address first. Check your inbox for the link.',
        emailAddressInvalid: "This email address isn't valid.",
        fileTooLarge: 'The picture is too large. Choose a smaller one.',
        invalidFileType: "This file type isn't supported. Choose a JPG, PNG or WebP picture.",
        unknown: 'Please try again. If it keeps happening, try again later.',
        weakPassword:
          'Password is too weak. A password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      },
      unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?'
    }
  }
};

export default messages;
