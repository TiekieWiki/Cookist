<template>
  <main>
    <router-view />
  </main>
  <aside>
    <nav>
      <router-link to="/" tabindex="0">{{ $t('homePage.title') }}</router-link>
      <router-link to="/recipes" tabindex="0">{{ $t('recipesPage.title') }}</router-link>
      <router-link to="/login" v-if="!isLoggedIn" tabindex="0">{{
        $t('loginPage.title')
      }}</router-link>
      <a @click="handleSignOut" v-if="isLoggedIn" :aria-label="$t('ariaLabel.logout')" tabindex="0">
        {{ $t('nav.logout') }}
      </a>
    </nav>
    <div class="banner">
      <img src="/src/assets/images/Banner.jpg" :alt="$t('alt.banner')" />
    </div>
    <router-link to="/" class="brand">Cookist</router-link>
  </aside>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { handleSignOut } from './utils/authentication';
import { useIsLoggedIn } from './composables/useAuthentication';

const isLoggedIn = useIsLoggedIn();
</script>
