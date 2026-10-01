import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/main.scss';
import i18n from './i18n/index';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft,
  faArrowRight,
  faArrowRightFromBracket,
  faBahai,
  faBars,
  faBasketShopping,
  faBook,
  faBowlFood,
  faCalendar,
  faCarrot,
  faHandshake,
  faLinkSlash,
  faMartiniGlassEmpty,
  faMinus,
  faPause,
  faPen,
  faPlay,
  faPlus,
  faRotateLeft,
  faSliders,
  faStar,
  faStopwatch,
  faTrash,
  faTrashCan,
  faUserGroup,
  faUtensils,
  faWineGlassEmpty,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { faClock as farClock } from '@fortawesome/free-regular-svg-icons';

library.add(
  faArrowLeft,
  faArrowRight,
  faArrowRightFromBracket,
  faBahai,
  faBars,
  faBasketShopping,
  faBook,
  faBowlFood,
  faCalendar,
  faCarrot,
  faHandshake,
  faLinkSlash,
  faMartiniGlassEmpty,
  faMinus,
  faPause,
  faPen,
  faPlay,
  faPlus,
  faRotateLeft,
  faSliders,
  faStar,
  faStopwatch,
  faTrash,
  faTrashCan,
  faUserGroup,
  faUtensils,
  faWineGlassEmpty,
  faXmark,
  farClock
);

const pinia = createPinia();

const app = createApp(App)
  .use(pinia)
  .use(i18n)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon);

router.isReady().then(() => app.mount('#app'));
