<template>
  <main class="home three-columns">
    <article>
      <section class="header">
        <router-link to="/" class="brand" tabindex="0">Cookist</router-link>
      </section>
    </article>
    <article id="home-banner-1" class="card">
      <!-- Photo by Joseph Gonzalez on Unsplash -->
      <section class="title">
        <h3>{{ $t('homePage.banner1') }}</h3>
      </section>
    </article>
    <article id="home-banner-2" class="card">
      <!-- Photo by Chad Montano on Unsplash -->
      <section class="title">
        <h3>{{ $t('homePage.banner2') }}</h3>
      </section>
    </article>
    <article id="home-banner-3" class="card">
      <!-- Photo by Chad Montano on Unsplash -->
      <section class="title">
        <h3>{{ $t('homePage.banner3') }}</h3>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

// Set the images for the banners on mount
onMounted(() => {
  const homeBanner1 = document.getElementById('home-banner-1');
  if (homeBanner1) {
    homeBanner1.style.backgroundImage = `url(src/assets/images/HomeBanner1.jpg)`;
  }
  const homeBanner2 = document.getElementById('home-banner-2');
  if (homeBanner2) {
    homeBanner2.style.backgroundImage = `url(src/assets/images/HomeBanner2.jpg)`;
  }
  const homeBanner3 = document.getElementById('home-banner-3');
  if (homeBanner3) {
    homeBanner3.style.backgroundImage = `url(src/assets/images/HomeBanner3.jpg)`;
  }
});
</script>
