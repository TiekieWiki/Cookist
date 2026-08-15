<template>
  <nav>
    <div class="brand">
      <div class="logo"><font-awesome-icon :icon="['fas', 'utensils']" /></div>
      <router-link to="/" tabindex="0">Cookist</router-link>
    </div>
    <div class="menu">
      <router-link to="/" class="desktop" tabindex="-1">
        <Button
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="ButtonSize.LARGE"
          >{{ $t('homePage.title') }}</Button
        ></router-link
      >
      <router-link to="/recipes" class="desktop" tabindex="-1"
        ><Button
          v-if="userStore.isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="ButtonSize.LARGE"
        >
          {{ $t('recipesPage.title') }}
        </Button></router-link
      >
      <router-link to="/grocery-list" class="desktop" tabindex="-1"
        ><Button
          v-if="userStore.isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="ButtonSize.LARGE"
        >
          {{ $t('groceryListPage.title') }}
        </Button></router-link
      >
      <router-link to="/profile" class="desktop" tabindex="-1">
        <Button
          v-if="userStore.isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="ButtonSize.LARGE"
        >
          {{ $t('profilePage.title') }}
        </Button>
      </router-link>
      <router-link to="/login" class="desktop" tabindex="-1">
        <Button
          v-if="!userStore.isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="ButtonSize.LARGE"
        >
          {{ $t('loginPage.title') }}
        </Button></router-link
      >
      <Button
        v-if="!menuOpen"
        class="mobile"
        @click.stop="menuOpen = true"
        :type="ButtonType.BUTTON"
        :variant="ColorVariant.TERTIARY"
        :size="ButtonSize.LARGE"
      >
        <font-awesome-icon :icon="['fas', 'bars']" />
      </Button>
    </div>
  </nav>
  <div v-if="menuOpen" class="overlay"></div>
  <Transition name="slide-fade">
    <aside v-if="menuOpen" class="mobile">
      <Button
        @click="menuOpen = false"
        :type="ButtonType.BUTTON"
        :variant="ColorVariant.TERTIARY"
        :size="ButtonSize.LARGE"
      >
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </Button>
      <router-link to="/" tabindex="-1"
        ><Button
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="ButtonSize.LARGE"
        >
          {{ $t('homePage.title') }}
        </Button></router-link
      >

      <router-link to="/recipes" tabindex="-1"
        ><Button
          v-if="userStore.isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="ButtonSize.LARGE"
          >{{ $t('recipesPage.title') }}
        </Button></router-link
      >

      <router-link to="/grocery-list" tabindex="-1"
        ><Button
          v-if="userStore.isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="ButtonSize.LARGE"
          >{{ $t('groceryListPage.title') }}
        </Button></router-link
      >

      <router-link to="/login" tabindex="-1"
        ><Button
          v-if="!userStore.isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="ButtonSize.LARGE"
          >{{ $t('loginPage.title') }}
        </Button></router-link
      >

      <router-link to="/profile" tabindex="-1"
        ><Button
          v-if="userStore.isLoggedIn"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="ButtonSize.LARGE"
        >
          {{ $t('profilePage.title') }}
        </Button>
      </router-link>
    </aside>
  </Transition>
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
  <ErrorMessage v-model:message="profileStore.errorMessage" />
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
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import { useUserStore } from './stores/useUserStore';
import { useProfileStore } from './stores/useProfileStore';

const route = useRoute();
const { t, locale } = useI18n();
const userStore = useUserStore();
const profileStore = useProfileStore();
const profile = ref<Profile | undefined>(undefined);
const menuOpen = ref<boolean>(false);

// Set user language
onMounted(async () => {
  await userStore.getUser();

  if (userStore.isLoggedIn) {
    await profileStore.getProfile();

    if (profileStore.profile) {
      profile.value = profileStore.profile;
      setUserLanguage(profile.value.language);
      setColorScheme(profile.value.colorscheme);
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
