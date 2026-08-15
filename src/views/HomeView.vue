<template>
  <main class="home">
    <article class="banner">
      <section class="info">
        <h1>{{ $t('homePage.banner.title') }}</h1>
        <p>{{ $t('homePage.banner.subtitle') }}</p>
        <div class="buttons">
          <router-link to="/" tabindex="-1"
            ><Button
              :type="ButtonType.BUTTON"
              :variant="ColorVariant.PRIMARY"
              :size="ButtonSize.LARGE"
            >
              {{ $t('homePage.banner.browseRecipes')
              }}<font-awesome-icon :icon="['fas', 'arrow-right']" /> </Button
          ></router-link>
          <router-link to="/" tabindex="-1"
            ><Button
              :type="ButtonType.BUTTON"
              :variant="ColorVariant.SECONDARY"
              :size="ButtonSize.LARGE"
            >
              {{ $t('homePage.banner.addRecipe') }}
            </Button></router-link
          >
        </div>
      </section>
      <section class="image">
        <img src="../assets/images/Banner.jpg" alt="" />
        <div class="image-info">
          <p class="small">{{ $t('homePage.image.longestUntouched') }}</p>
          <p>{{ $t('homePage.image.recipeTitle') }}</p>
          <p class="small">{{ $t('homePage.image.lastEaten') }}</p>
        </div>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
import { ButtonSize, ButtonType, ColorVariant } from '@/utils/types/enums';
import Button from '@/components/form/Button.vue';
</script>
