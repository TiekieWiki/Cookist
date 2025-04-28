import i18n from '@/i18n';
import { getImage } from '@/utils/manageImage';
import type { Recipe } from '@/utils/types/recipe';
import { onMounted, onUnmounted, type Ref } from 'vue';

/**
 * Set the recipe image when the component is mounted and remove it when unmounted
 * @param recipe Recipe object to set the image for
 */
export function useSetRecipeImage(recipe: Ref<Recipe>): void {
  // Set the recipe image
  onMounted(() => {
    getImage(recipe.value.image).then((url) => {
      const img = document.querySelector('.banner')?.querySelector('img');
      if (img) {
        img.src = url;
        img.alt = recipe.value.name;
      }
    });
  });

  // Remove the image when the component is unmounted
  onUnmounted(() => {
    const img = document.querySelector('.banner')?.querySelector('img');
    if (img) {
      img.src = '/src/assets/images/Banner.jpg';
      img.alt = i18n.global.t('alt.banner');
    }
  });
}
