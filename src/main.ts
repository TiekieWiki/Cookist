import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/main.scss';
import i18n from './i18n/index';
import { useToastStore } from './stores/useToastStore';
import { toActionError } from './utils/global/errorHandling';
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
  faCircleCheck,
  faCircleExclamation,
  faEllipsisVertical,
  faHandshake,
  faLinkSlash,
  faMartiniGlassEmpty,
  faMinus,
  faPause,
  faPen,
  faPlay,
  faPlus,
  faRotateLeft,
  faRotateRight,
  faSliders,
  faStar,
  faStopwatch,
  faTrash,
  faTrashCan,
  faTriangleExclamation,
  faUserGroup,
  faUtensils,
  faWifi,
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
  faCircleCheck,
  faCircleExclamation,
  faHandshake,
  faLinkSlash,
  faMartiniGlassEmpty,
  faMinus,
  faPause,
  faPen,
  faPlay,
  faPlus,
  faRotateLeft,
  faRotateRight,
  faSliders,
  faStar,
  faStopwatch,
  faTrash,
  faTrashCan,
  faTriangleExclamation,
  faUserGroup,
  faUtensils,
  faWifi,
  faWineGlassEmpty,
  faXmark,
  farClock,
  faEllipsisVertical
);

const pinia = createPinia();

const app = createApp(App)
  .use(pinia)
  .use(i18n)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon);

const toastStore = useToastStore(pinia);

app.config.errorHandler = (error) => {
  toastStore.showActionError(toActionError('unexpected', error));
};

router.onError((error) => {
  toastStore.showActionError(toActionError('loadPage', error));
});

window.addEventListener('unhandledrejection', (event) => {
  toastStore.showActionError(toActionError('unexpected', event.reason));
});

router
  .isReady()
  .catch(() => undefined)
  .then(() => app.mount('#app'));
