import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/main.scss';
import i18n from './i18n';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);

createApp(App).use(i18n).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app');
