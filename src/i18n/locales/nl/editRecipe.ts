import type en from '../en/editRecipe';

const messages: typeof en = {
  editRecipePage: {
    subtitle:
      'Je kunt het zo kort of zo gedetailleerd houden als je wilt — je kan altijd terugkomen.',
    backToRecipes: 'Terug naar recepten',
    name: 'Naam',
    duration: 'Duur (min)',
    portions: 'Porties',
    rating: 'Beoordeling',
    image: 'Afbeelding',
    instructions: 'Instructies',
    notes: 'Aantekeningen',
    save: 'Recept opslaan',
    placeholder: {
      name: 'Pasta Carbonara',
      category: 'Avondeten',
      duration: '30',
      portions: '4',
      rating: '5',
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
      instruction: 'Instructie van het recept',
      notes: 'Aantekeningen over het recept'
    },
    alt: {
      previewImage: 'Voorbeeld van de receptafbeelding'
    },
    errors: {
      nameMissing: 'Geef je recept een naam',
      categoryMissing: 'Kies een categorie',
      durationMissing: 'Vul in hoe lang het duurt',
      durationInvalid: 'De duur moet minstens 1 minuut zijn',
      portionsMissing: 'Vul het aantal porties in',
      portionsInvalid: 'Er moet minstens 1 portie zijn',
      ratingInvalid: 'Geef een beoordeling van 0 tot 5',
      ingredientsMissing: 'Voeg minstens één ingrediënt toe met een hoeveelheid, eenheid en naam',
      instructionsMissing: 'Voeg minstens één stap toe'
    }
  }
};

export default messages;
