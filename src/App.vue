<template>
  <router-view v-slot="{ Component }">
    <transition name="slide-fade">
      <component :is="Component" />
    </transition>
  </router-view>
  <aside :class="menuOpen ? 'menuOpen' : 'menuClose'">
    <nav>
      <transition name="switch" mode="out-in" appear>
        <font-awesome-icon
          v-if="!menuOpen"
          @click="menuOpen = true"
          class="menu-icon"
          :icon="['fas', 'bars']"
        />
        <font-awesome-icon
          v-else
          @click="menuOpen = false"
          class="menu-icon"
          :icon="['fas', 'xmark']"
        />
      </transition>
      <transition name="slide-fade">
        <router-link v-if="menuOpen" :to="{ name: $t('homePage.title') }" tabindex="0">{{
          $t('homePage.title')
        }}</router-link>
      </transition>
      <transition name="slide-fade">
        <router-link v-if="menuOpen" :to="{ name: $t('recipesPage.title') }" tabindex="0">{{
          $t('recipesPage.title')
        }}</router-link>
      </transition>
      <transition name="slide-fade">
        <router-link
          :to="{ name: $t('loginPage.title') }"
          v-if="menuOpen && !isLoggedIn"
          tabindex="0"
          >{{ $t('loginPage.title') }}</router-link
        >
      </transition>
      <transition name="slide-fade">
        <router-link
          :to="{ name: $t('profilePage.title') }"
          v-if="menuOpen && isLoggedIn"
          tabindex="0"
        >
          {{ $t('profilePage.title') }}
        </router-link>
      </transition>
    </nav>
    <div class="banner">
      <img src="/src/assets/images/Banner.jpg" :alt="$t('alt.banner')" />
    </div>
    <transition name="slide-fade">
      <router-link v-if="menuOpen" :to="{ name: $t('homePage.title') }" class="brand"
        >Cookist</router-link
      >
    </transition>
  </aside>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { useIsLoggedIn } from './composables/useAuthentication';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { getData } from './utils/db';
import { where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { User } from './utils/types/user';
import { useSetSystemLanguage, useSetUserLanguage } from './composables/useI18n';

const isLoggedIn = useIsLoggedIn();
const user = ref<User | undefined>(undefined);
const menuOpen = ref<boolean>(false);
const route = useRoute();

// Set user language
watch(isLoggedIn, async () => {
  if (isLoggedIn.value) {
    try {
      const users = await getData('users', where('id', '==', getAuth().currentUser?.uid));
      if (users.length > 0) {
        user.value = users[0] as User;
        useSetUserLanguage(user.value?.language);
      }
    } catch (error: any) {
      alert(error.message);
    }
  } else {
    useSetSystemLanguage();
  }
});

// Reset menuOpen when the route changes
watch(
  () => route.path,
  () => {
    menuOpen.value = false;
  }
);

// Close menu
onMounted(() => {
  // Close menu when the window is resized
  window.addEventListener('resize', () => {
    menuOpen.value = false;
  });

  // Close menu when escape is pressed
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      menuOpen.value = false;
    }
  });

  // Close menu when clicked outside of the menu
  window.addEventListener('click', (event) => {
    if (menuOpen.value && !(event.target as HTMLElement).closest('aside')) {
      menuOpen.value = false;
    }
  });
});

// Remove event listeners when the component is unmounted
onUnmounted(() => {
  window.removeEventListener('resize', () => {
    menuOpen.value = false;
  });
  window.removeEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      menuOpen.value = false;
    }
  });
  window.removeEventListener('click', (event) => {
    if (menuOpen.value && !(event.target as HTMLElement).closest('aside')) {
      menuOpen.value = false;
    }
  });
});
</script>
