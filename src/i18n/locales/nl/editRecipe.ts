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
    }
  }
};

export default messages;
