import type en from '../en/login';

const messages: typeof en = {
  loginPage: {
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
    policy: 'Door door te gaan, stem je ermee in om te blijven koken.',
    placeholder: {
      email: "john.doe{'@'}gmail.com",
      password: '********'
    },
    ariaLabel: {
      email: 'Email',
      password: 'Wachtwoord'
    }
  }
};

export default messages;
