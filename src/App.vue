<template>
  <router-view v-slot="{ Component }">
    <Transition name="slide-fade">
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
    </Transition>
  </router-view>
  <ErrorMessage v-model:message="errorMessage" />
  <aside :class="menuOpen ? 'menuOpen' : 'menuClose'">
    <nav>
      <Transition name="switch" mode="out-in" appear>
        <Button
          v-if="!menuOpen"
          @click="menuOpen = true"
          :type="ButtonType.BUTTON"
          :icon-only="true"
          :variant="ColorVariant.SECONDARY"
          :size="ButtonSize.LARGE"
        >
          <font-awesome-icon :icon="['fas', 'bars']" tabindex="0" />
        </Button>
        <Button
          v-else
          @click="menuOpen = !menuOpen"
          :type="ButtonType.BUTTON"
          :icon-only="true"
          :variant="ColorVariant.SECONDARY"
          :size="ButtonSize.LARGE"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" tabindex="0" />
        </Button>
      </Transition>
      <Transition name="slide-fade">
        <Button v-if="menuOpen" :type="ButtonType.BUTTON" :variant="ColorVariant.NEUTRAL">
          <router-link to="/" tabindex="0">{{ $t('homePage.title') }}</router-link>
        </Button>
      </Transition>
      <Transition name="slide-fade">
        <Button
          v-if="menuOpen && isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.NEUTRAL"
        >
          <router-link to="/recipes" tabindex="0">{{ $t('recipesPage.title') }}</router-link>
        </Button>
      </Transition>
      <Transition name="slide-fade">
        <Button
          v-if="menuOpen && isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.NEUTRAL"
        >
          <router-link to="/grocery-list" tabindex="0">{{
            $t('groceryListPage.title')
          }}</router-link>
        </Button>
      </Transition>
      <Transition name="slide-fade">
        <Button
          v-if="menuOpen && !isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.NEUTRAL"
        >
          <router-link to="/login" tabindex="0">{{ $t('loginPage.title') }}</router-link>
        </Button>
      </Transition>
      <Transition name="slide-fade">
        <Button
          v-if="menuOpen && isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.NEUTRAL"
        >
          <router-link to="/profile" tabindex="0">
            {{ $t('profilePage.title') }}
          </router-link>
        </Button>
      </Transition>
    </nav>
    <div class="banner">
      <!-- Photo by Andy Chilton on Unsplash -->
      <img src="/src/assets/images/Banner.jpg" alt="" />
    </div>
    <Transition name="slide-fade">
      <router-link v-if="menuOpen" to="/" class="brand" tabindex="0">Cookist</router-link>
    </Transition>
  </aside>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { Profile } from './utils/types/profile';
import { setSystemLanguage, setUserLanguage } from './utils/global/setLanguage';
import { useI18n } from 'vue-i18n';
import { lazyLoadLocaleMessages } from './i18n';
import { setColorScheme, setHandedness } from './utils/global/setInterfaceVariables';
import Button from './components/form/Button.vue';
import { ButtonSize, ButtonType, ColorVariant } from './utils/types/enums';
import { getUserProfile } from './utils/profile/queries/getUserProfile';
import { isLoggedIn } from '@/stores/useUserLoggedInStore';

const profile = ref<Profile | undefined>(undefined);
const menuOpen = ref<boolean>(false);
const route = useRoute();
const { t, locale } = useI18n();
const errorMessage = ref<string>('');

// Set user language
onMounted(async () => {
  if (isLoggedIn.value) {
    const { errorMessage: profileErrorMessage, profile: userProfile } = await getUserProfile();

    if (profileErrorMessage.value) {
      errorMessage.value = profileErrorMessage.value;
    } else if (userProfile) {
      profile.value = userProfile;
      setUserLanguage(profile.value.language);
      setColorScheme(profile.value.colorScheme);
      setHandedness(profile.value.handedness);
    } else {
      setSystemLanguage();
    }
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
onMounted(async () => {
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
