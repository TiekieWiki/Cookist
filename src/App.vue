<template>
  <nav>
    <div class="brand">
      <div class="logo"><font-awesome-icon :icon="['fas', 'utensils']" /></div>
      <router-link to="/" tabindex="0">Cookist</router-link>
    </div>
    <div class="menu">
      <template v-for="item in menuItems()" :key="item.route">
        <Button
          v-if="item.condition ?? true"
          class="desktop"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="Size.LARGE"
          :to="item.route"
          >{{ $t(item.name) }}</Button
        ></template
      >
      <Button
        v-if="!menuOpen"
        class="mobile"
        @click.stop="menuOpen = true"
        :type="ButtonType.BUTTON"
        :variant="ColorVariant.TERTIARY"
        :size="Size.LARGE"
      >
        <font-awesome-icon :icon="['fas', 'bars']" />
      </Button>
    </div>
  </nav>
  <Transition name="fade">
    <div v-if="menuOpen" class="overlay"></div>
  </Transition>
  <Transition name="slide-fade">
    <aside v-if="menuOpen" class="mobile">
      <Button
        @click="menuOpen = false"
        :type="ButtonType.BUTTON"
        :variant="ColorVariant.TERTIARY"
        :size="Size.LARGE"
      >
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </Button>
      <template v-for="item in menuItems()" :key="item.route"
        ><Button
          v-if="item.condition ?? true"
          :type="ButtonType.BUTTON"
          :variant="ColorVariant.TERTIARY"
          :size="Size.LARGE"
          :to="item.route"
        >
          {{ $t(item.name) }}
        </Button></template
      >
    </aside>
  </Transition>
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </template>
  </router-view>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Button from './components/form/Button.vue';
import { Size, ButtonType, ColorVariant } from './utils/types/enums';
import { useSession } from './composables/useSession';
import { useMenu } from './composables/useMenu.ts';
import { menuItems } from './utils/global/menu.ts';

const { menuOpen } = useMenu();
useSession();
</script>
