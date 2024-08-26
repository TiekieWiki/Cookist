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
import { ref, watch } from 'vue';

const isLoggedIn = useIsLoggedIn();
const menuOpen = ref<boolean>(false);
const route = useRoute();

// Reset menuOpen when the route changes
watch(
  () => route.path,
  () => {
    menuOpen.value = false;
  }
);
</script>
