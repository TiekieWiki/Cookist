import type en from '../en/home';

const messages: typeof en = {
  homePage: {
    banner: {
      pill: 'Jouw kookboek, met een geheugen',
      title: 'Kook de recepten die je vergeten was dat je ze lekker vond.',
      subtitle:
        'Cookist houdt je recepten bij en registreert wanneer je ze voor het laatst hebt gemaakt — zodat de goede recepten weer boven komen drijven in plaats van stof te verzamelen.',
      browseRecipes: 'Bekijk mijn recepten',
      addRecipe: 'Voeg recept toe',
      longestUntouched: 'Lang niet aangeraakt',
      recipeTitle: 'Pompoen spruitjes salade',
      lastEaten: '8 maanden'
    },
    forgottenRecipes: {
      title: 'Stof vergaren',
      subtitle: 'Drie gerechten die lang genoeg hebben gewacht',
      allRecipes: 'Alles weergeven'
    },
    actionPoints: {
      lastEaten: {
        title: 'Gesorteerd op vergeten',
        subtitle:
          'Elk recept draagt ​​een stille stofmeter met zich mee. Hoe langer geleden je het hebt bereid, des te hoger de meter oploopt.'
      },
      nutrition: {
        title: 'Voedingswaarden — binnenkort',
        subtitle:
          'Voedingswaarden per portie berekend op basis van je ingrediëntenlijst – geen spreadsheet nodig.'
      },
      recipeMatcher: {
        title: 'Recept matcher — binnenkort',
        subtitle:
          'Twee personen, één stapel recepten. Swipe tot jullie allebei bij hetzelfde recept uitkomen.'
      }
    }
  }
};

export default messages;
