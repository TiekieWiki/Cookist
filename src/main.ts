import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/main.scss';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({});

createApp(App).use(i18n).use(router).mount('#app');
