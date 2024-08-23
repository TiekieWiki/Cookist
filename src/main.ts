import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/main.scss';
import i18n from './i18n';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDsV52geSwg2PTIwcAwoQrQ5qTlBN5HO8U',
  authDomain: 'cookist-ff962.firebaseapp.com',
  projectId: 'cookist-ff962',
  storageBucket: 'cookist-ff962.appspot.com',
  messagingSenderId: '291100764441',
  appId: '1:291100764441:web:95129835552e5a8ac9fd88'
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore();
export default db;

createApp(App).use(i18n).use(router).mount('#app');
