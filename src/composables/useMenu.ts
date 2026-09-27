import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

/**
 * Composable to manage the menu state
 * @returns Menu open
 */
export function useMenu(): {
  menuOpen: Ref<boolean>;
} {
  const route = useRoute();
  const { t, locale } = useI18n();
  const menuOpen = ref<boolean>(false);

  // Translate the page title when the language changes
  watch(locale, () => {
    document.title = t(String(route.meta.title)) || 'Cookist';
  });

  // Reset menuOpen when the route changes
  watch(
    () => route.path,
    () => {
      menuOpen.value = false;
    }
  );

  // Close menu when the window is resized
  function closeMenuOnResize(): void {
    menuOpen.value = false;
  }

  // Close menu when escape is pressed
  function closeMenuOnEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      menuOpen.value = false;
    }
  }

  // Close menu when clicked outside of the menu
  function closeMenuOnOutsideClick(event: MouseEvent): void {
    if (menuOpen.value && !(event.target as HTMLElement).closest('aside')) {
      menuOpen.value = false;
    }
  }

  onMounted(() => {
    window.addEventListener('resize', closeMenuOnResize);
    window.addEventListener('keydown', closeMenuOnEscape);
    window.addEventListener('click', closeMenuOnOutsideClick);
  });

  // Remove event listeners when the component is unmounted
  onUnmounted(() => {
    window.removeEventListener('resize', closeMenuOnResize);
    window.removeEventListener('keydown', closeMenuOnEscape);
    window.removeEventListener('click', closeMenuOnOutsideClick);
  });

  return { menuOpen };
}
