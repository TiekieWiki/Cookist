import { supabase } from '@/utils/global/supabase';
import { DEFAULT_RECIPE_IMAGE_SRC } from '@/utils/global/variables';

export const IMAGE_URL_LIFETIME = 3600;

/**
 * Get signed image URLs for recipes in one request. Recipes without an image get the default image.
 * @param recipeIds Recipe ids
 * @returns {Promise<Record<string, string> | null>} Image URL per recipe id, or null when the
 * request failed
 */
export async function getRecipeImageUrls(
  recipeIds: string[]
): Promise<Record<string, string> | null> {
  if (!recipeIds.length) return {};

  const { data, error } = await supabase.storage
    .from('recipe_images')
    .createSignedUrls(recipeIds, IMAGE_URL_LIFETIME);

  if (error) return null;

  const signedUrls = new Map(
    data.map((image) => [image.path, image.error ? null : image.signedUrl])
  );

  return Object.fromEntries(
    recipeIds.map((id) => [id, signedUrls.get(id) || DEFAULT_RECIPE_IMAGE_SRC])
  );
}
