<template>
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
</template>

<script setup lang="ts">
import { ColorVariant, Size } from '@/utils/types/enums';
import Pill from '@/components/general/Pill.vue';
</script>
