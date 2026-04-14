<template>
  <router-view v-slot="{ Component }">
    <transition name="slide-fade">
      <suspense>
        <template #default>
          <component :is="Component" />
        </template>
        <template #fallback>
          <div class="loader">
            <div class="loader-spinner"></div>
          </div>
        </template>
      </suspense>
    </transition>
  </router-view>
  <aside :class="menuOpen ? 'menuOpen' : 'menuClose'">
    <nav>
      <transition name="switch" mode="out-in" appear>
        <Button
          v-if="!menuOpen"
          @click="menuOpen = true"
          :type="ButtonType.BUTTON"
          :icon-only="true"
          :variant="ColorVariant.NEUTRAL"
          :size="ButtonSize.LARGE"
        >
          <font-awesome-icon :icon="['fas', 'bars']" tabindex="0" />
        </Button>
        <Button
          v-else
          @click="menuOpen = false"
          :type="ButtonType.BUTTON"
          :icon-only="true"
          :variant="ColorVariant.NEUTRAL"
          :size="ButtonSize.LARGE"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" tabindex="0" />
        </Button>
      </transition>
      <transition name="slide-fade">
        <Button v-if="menuOpen" :type="ButtonType.BUTTON" :variant="ColorVariant.NEUTRAL">
          <router-link to="/" tabindex="0">{{ $t('homePage.title') }}</router-link>
        </Button>
      </transition>
      <transition name="slide-fade">
        <Button
          v-if="menuOpen && isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.NEUTRAL"
        >
          <router-link to="/recipes" tabindex="0">{{ $t('recipesPage.title') }}</router-link>
        </Button>
      </transition>
      <transition name="slide-fade">
        <Button
          v-if="menuOpen && isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.NEUTRAL"
        >
          <router-link to="/cookgroups" tabindex="0">{{ $t('cookGroupsPage.title') }}</router-link>
        </Button>
      </transition>
      <transition name="slide-fade">
        <Button
          v-if="menuOpen && isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.NEUTRAL"
        >
          <router-link to="/grocery-list" tabindex="0">{{
            $t('groceryListPage.title')
          }}</router-link>
        </Button>
      </transition>
      <transition name="slide-fade">
        <Button
          v-if="menuOpen && !isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.NEUTRAL"
        >
          <router-link to="/login" tabindex="0">{{ $t('loginPage.title') }}</router-link>
        </Button>
      </transition>
      <transition name="slide-fade">
        <Button
          v-if="menuOpen && isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.NEUTRAL"
        >
          <router-link to="/profile" tabindex="0">
            {{ $t('profilePage.title') }}
          </router-link>
        </Button>
      </transition>
    </nav>
    <div class="banner">
      <!-- Photo by Andy Chilton on Unsplash -->
      <img src="/src/assets/images/Banner.jpg" alt="" />
    </div>
    <transition name="slide-fade">
      <router-link v-if="menuOpen" to="/" class="brand" tabindex="0">Cookist</router-link>
    </transition>
  </aside>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { useIsLoggedIn } from './composables/useAuthentication';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { getData } from './utils/global/db';
import { where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { User } from './utils/types/user';
import { setSystemLanguage, setUserLanguage } from './utils/global/setLanguage';
import { useI18n } from 'vue-i18n';
import { lazyLoadLocaleMessages } from './i18n';
import { setColorScheme, setHandedness } from './utils/global/setInterfaceVariables';
import Button from './components/form/Button.vue';
import { ButtonSize, ButtonType, ColorVariant } from './utils/types/enums';

const isLoggedIn = useIsLoggedIn();
const user = ref<User | undefined>(undefined);
const menuOpen = ref<boolean>(false);
const route = useRoute();
const { t, locale } = useI18n();

// Set user language
watch(isLoggedIn, async () => {
  if (isLoggedIn.value) {
    await getData('users', where('id', '==', getAuth().currentUser?.uid))
      .then((users) => {
        if (users.length > 0) {
          user.value = users[0] as User;
          setUserLanguage(user.value?.language);
          setColorScheme(user.value?.colorScheme);
          setHandedness(user.value?.handedness || 'right');
        }
      })
      .catch((error: any) => {
        console.error('Error setting user language:', error);
      });
  } else {
    setSystemLanguage();
  }
});

// Set language
watch(locale, () => {
  document.title = t(String(route.meta.title)) || 'Cookist';
  lazyLoadLocaleMessages(locale.value);
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
