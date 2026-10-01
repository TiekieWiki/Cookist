<template>
  <article class="banner">
    <section class="info">
      <Pill :variant="ColorVariant.SECONDARY" :size="Size.LARGE">
        <font-awesome-icon :icon="['fas', 'bahai']" />
        {{ $t('homePage.banner.pill') }}
      </Pill>
      <h1>{{ $t('homePage.banner.title') }}</h1>
      <p>{{ $t('homePage.banner.subtitle') }}</p>
      <div class="buttons">
        <Button
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.PRIMARY"
          :size="Size.LARGE"
          to="/recipes"
        >
          {{ $t('homePage.banner.browseRecipes')
          }}<font-awesome-icon :icon="['fas', 'arrow-right']" />
        </Button>
        <Button
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.SECONDARY"
          :size="Size.LARGE"
          to="/create-recipe"
        >
          {{ $t('homePage.banner.addRecipe') }}
        </Button>
      </div>
    </section>
    <section class="image">
      <img src="@/assets/images/Banner.jpg" alt="" />
      <div class="image-info">
        <p class="small">{{ $t('homePage.banner.longestUntouched') }}</p>
        <p>{{ $t('homePage.banner.recipeTitle') }}</p>
        <p class="small">{{ $t('homePage.banner.lastEaten') }}</p>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import Button from '@/components/form/Button.vue';
import Pill from '@/components/general/Pill.vue';
</script>
