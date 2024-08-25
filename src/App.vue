<template>
  <main>
    <router-view />
  </main>
  <aside :class="menuOpen ? 'menuOpen' : 'menuClose'">
    <nav>
      <transition name="switch" mode="out-in">
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
        <router-link v-if="menuOpen" to="/" tabindex="0">{{ $t('homePage.title') }}</router-link>
      </transition>
      <transition name="slide-fade">
        <router-link v-if="menuOpen" to="/recipes" tabindex="0">{{
          $t('recipesPage.title')
        }}</router-link>
      </transition>
      <transition name="slide-fade">
        <router-link to="/login" v-if="menuOpen && !isLoggedIn" tabindex="0">{{
          $t('loginPage.title')
        }}</router-link>
      </transition>
      <transition name="slide-fade">
        <a
          @click="handleSignOut"
          v-if="menuOpen && isLoggedIn"
          :aria-label="$t('ariaLabel.logout')"
          tabindex="0"
        >
          {{ $t('nav.logout') }}
        </a>
      </transition>
    </nav>
    <div class="banner">
      <img src="/src/assets/images/Banner.jpg" :alt="$t('alt.banner')" />
    </div>
    <transition name="slide-fade">
      <router-link v-if="menuOpen" to="/" class="brand">Cookist</router-link>
    </transition>
  </aside>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { handleSignOut } from './utils/authentication';
import { useIsLoggedIn } from './composables/useAuthentication';
import { ref } from 'vue';

const isLoggedIn = useIsLoggedIn();
const menuOpen = ref<boolean>(false);
</script>
