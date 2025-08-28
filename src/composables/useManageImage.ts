import { getImage } from '@/utils/global/manageImage';
import type { Recipe } from '@/utils/types/recipe';
import { onMounted, onUnmounted, type Ref } from 'vue';

/**
 * Set the recipe image when the component is mounted and remove it when unmounted
 * @param recipe Recipe object to set the image for
 */
export function useSetRecipeImage(recipe: Ref<Recipe>): void {
  // Set the recipe image
  onMounted(() => {
    getImage(recipe.value.image)
      .then((url) => {
        const img = document.querySelector('.banner')?.querySelector('img');
        if (img) {
          img.src = url;
        }
      })
      .catch(() => {
        try {
          // Set default image if the image is not found
          // Photo by NordWood Themes on Unsplash
          const img = document.querySelector('.banner')?.querySelector('img');
          if (img) {
            img.src = '/src/assets/images/DefaultRecipe.jpg';
          }
        } catch (error) {
          console.error('Error setting default image:', error);
        }
      });
  });

  // Remove the image when the component is unmounted
  onUnmounted(() => {
    const img = document.querySelector('.banner')?.querySelector('img');
    if (img) {
      // Photo by Andy Chilton on Unsplash
      img.src = '/src/assets/images/Banner.jpg';
    }
  });
}
