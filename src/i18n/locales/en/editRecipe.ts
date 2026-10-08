const messages = {
  editRecipePage: {
    subtitle: 'Keep it as short or as detailed as you like — you can always come back.',
    backToRecipes: 'Back to recipes',
    name: 'Name',
    duration: 'Duration (min)',
    portions: 'Portions',
    rating: 'Rating',
    image: 'Picture',
    instructions: 'Instructions',
    notes: 'Notes',
    save: 'Save recipe',
    placeholder: {
      name: 'Pasta Carbonara',
      category: 'Dinner',
      duration: '30',
      portions: '4',
      rating: '5',
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
      instruction: 'Instruction of the recipe',
      notes: 'Notes about the recipe'
    },
    alt: {
      previewImage: 'Preview of the recipe image'
    },
    errors: {
      nameMissing: 'Give your recipe a name',
      categoryMissing: 'Choose a category',
      durationMissing: 'Fill in how long it takes',
      durationInvalid: 'The duration must be at least 1 minute',
      portionsMissing: 'Fill in the number of portions',
      portionsInvalid: 'There must be at least 1 portion',
      ratingInvalid: 'Give a rating from 0 to 5',
      ingredientsMissing: 'Add at least one ingredient with an amount, unit and name',
      instructionsMissing: 'Add at least one step'
    }
  }
};

export default messages;
