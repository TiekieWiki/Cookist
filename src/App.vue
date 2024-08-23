<template>
  <router-link to="/">{{ $t('homePage.title') }}</router-link>
  <router-link to="/recipes">{{ $t('recipesPage.title') }}</router-link>
  <router-link to="/add-recipe">{{ $t('addRecipePage.title') }}</router-link>
  <router-link to="/login">{{ $t('loginPage.title') }}</router-link>
  <button @click="handleSignOut" type="button">Log out</button>
  <router-view />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { handleSignOut } from './utils/authentication';
</script>
