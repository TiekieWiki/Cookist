import type en from '../en/profile';

const messages: typeof en = {
  profilePage: {
    logout: 'Log uit',
    statistics: {
      recipesCreated: 'Recepten gecreëerd',
      averageRating: 'Gemiddelde beoordeling',
      neverCooked: 'Nooit gekookt'
    },
    preferences: 'Voorkeuren',
    language: 'Taal',
    languageDescription: 'Als koken je tweede taal is, wat is je eerste?',
    languages: {
      en: 'Engels',
      nl: 'Nederlands'
    },
    colorScheme: 'Dark mode',
    colorSchemeDescription: 'Aangenamer voor de ogen.',
    measuringSystem: 'Meet systeem',
    measuringSystemDescription: 'Welk meetsysteem heeft je voorkeur?',
    measuringSystems: {
      metric: 'Metrisch',
      us_customary: 'Amerikaans gebruikelijk'
    },
    usePantry: 'Gebruik voorraadkast',
    usePantryDescription:
      'Schakel de voorraadkast in om bij te houden welke recepten je hebt gekookt of ingredienten voor hebt gekocht.',
    handedness: 'Handigheid',
    handednessDescription:
      'Je hebt maar twee handen, laten we er maar een voor je telefoon gebruiken.',
    handednessType: {
      right: 'Rechtshandig',
      left: 'Linkshandig',
      ambidextrous: 'Tweehandig'
    },
    save: 'Veranderingen opslaan',
    saveSuccess: 'Voorkeuren opgeslagen',
    deleteAccount: 'Account verwijderen',
    confirmDelete:
      'Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.',
    ariaLabel: {
      language: 'Taal',
      handedness: 'Handigheid',
      measuringSystem: 'Meet systeem'
    }
  }
};

export default messages;
