<template>
  <main class="home">
    <article class="banner">
      <section class="info">
        <Pill :variant="ColorVariant.SECONDARY" :size="Size.LARGE">
          <font-awesome-icon :icon="['fas', 'bahai']" />
          {{ $t('homePage.banner.pill') }}
        </Pill>
        <h1>{{ $t('homePage.banner.title') }}</h1>
        <p>{{ $t('homePage.banner.subtitle') }}</p>
        <div class="buttons">
          <router-link to="/" tabindex="-1"
            ><Button :type="ButtonType.BUTTON" :variant="ColorVariant.PRIMARY" :size="Size.LARGE">
              {{ $t('homePage.banner.browseRecipes')
              }}<font-awesome-icon :icon="['fas', 'arrow-right']" /> </Button
          ></router-link>
          <router-link to="/" tabindex="-1"
            ><Button :type="ButtonType.BUTTON" :variant="ColorVariant.SECONDARY" :size="Size.LARGE">
              {{ $t('homePage.banner.addRecipe') }}
            </Button></router-link
          >
        </div>
      </section>
      <section class="image">
        <img src="../assets/images/Banner.jpg" alt="" />
        <div class="image-info">
          <p class="small">{{ $t('homePage.banner.longestUntouched') }}</p>
          <p>{{ $t('homePage.banner.recipeTitle') }}</p>
          <p class="small">{{ $t('homePage.banner.lastEaten') }}</p>
        </div>
      </section>
    </article>
    <article class="actionPoints">
      <section>
        <Pill :variant="ColorVariant.PRIMARY" :size="Size.XLARGE">
          <font-awesome-icon :icon="['fas', 'calendar']" />
        </Pill>
        <h3>{{ $t('homePage.actionPoints.lastEaten.title') }}</h3>
        <p>{{ $t('homePage.actionPoints.lastEaten.subtitle') }}</p>
      </section>
      <section>
        <Pill :variant="ColorVariant.PRIMARY" :size="Size.XLARGE">
          <font-awesome-icon :icon="['fas', 'carrot']" />
        </Pill>
        <h3>{{ $t('homePage.actionPoints.nutrition.title') }}</h3>
        <p>{{ $t('homePage.actionPoints.nutrition.subtitle') }}</p>
      </section>
      <section>
        <Pill :variant="ColorVariant.PRIMARY" :size="Size.XLARGE">
          <font-awesome-icon :icon="['fas', 'handshake']" />
        </Pill>
        <h3>{{ $t('homePage.actionPoints.recipeMatcher.title') }}</h3>
        <p>{{ $t('homePage.actionPoints.recipeMatcher.subtitle') }}</p>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
import { Size, ButtonType, ColorVariant } from '@/utils/types/enums';
import Button from '@/components/form/Button.vue';
import Pill from '@/components/general/Pill.vue';
</script>
