import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '@/utils/global/supabase';
import { getErrorMessage } from '@/utils/global/errorHandling';
import { Ingredient } from '@/utils/types/recipe';
import { useUserStore } from './useUserStore';

export const useGroceryListStore = defineStore('groceryList', () => {
  const userStore = useUserStore();
  const groceryList = ref<Ingredient[]>([]);
  const errorMessage = ref<string>('');

    /**
     * Get the grocery list of the current user
     */
    async function getGroceryList(): Promise<void> {
        if (userStore.errorMessage) {
            errorMessage.value = userStore.errorMessage;
        } else if (!userStore.user) {
            errorMessage.value = getErrorMessage('unknown');
        } else {
            const { data, error } = await supabase.from('user_grocerylist').select('*').eq('user_id', userStore.user.id);
            
            if (error || !data) {
                errorMessage.value = getErrorMessage('unknown');
            } else {
                groceryList.value = data;
            }
        }
    }

    /**
     * Update an ingredient of the grocery list of the current user
     */
    async function setGroceryListIngredient(
        ingredient: Ingredient,
    ): Promise<void> {
        if (userStore.errorMessage) {
            errorMessage.value = userStore.errorMessage;
        } else if (!userStore.user) {
            errorMessage.value = getErrorMessage('unknown');
        } else {
            const { error } = await supabase
            .from('user_grocerylist')
            .update(ingredient)
            .eq('user_id', userStore.user?.id)
            .eq('id', ingredient.id);
        
            if (error) {
                errorMessage.value = getErrorMessage('unknown');
            } else {
                const ingredientIndex = groceryList.value.findIndex((item) => item.id === ingredient.id);
                if (ingredientIndex !== -1) {
                    groceryList.value[ingredientIndex] = ingredient;
                } else {
                    groceryList.value.push(ingredient);
                }
            }
        }
    }

    /**
     * Add ingredients to the grocery list of the current user
     */
    async function setGroceryList(
        ingredients: Ingredient[] | Ingredient,
    ): Promise<void> {
        if (userStore.errorMessage) {
            errorMessage.value = userStore.errorMessage;
        } else if (!userStore.user) {
            errorMessage.value = getErrorMessage('unknown');
        } else {
             const ingredientArray = Array.isArray(ingredients)
                ? ingredients
                : [ingredients];

            const { error } = await supabase
            .from('user_grocerylist')
            .insert(ingredientArray);
        
            if (error) {
                errorMessage.value = getErrorMessage('unknown');
            } else {
                groceryList.value.push(...ingredientArray);
            }
        }
    }

    /**
     * Delete an ingredient of the grocery list of the current user
     */
    async function deleteGroceryListIngredient(ingredientId: string): Promise<void> {
        if (userStore.errorMessage) {
            errorMessage.value = userStore.errorMessage;
            return;
        }

        const { error } = await supabase
        .from('user_grocerylist')
        .delete()
        .eq('user_id', userStore.user?.id)
        .eq('id', ingredientId);

        if (error) {
            errorMessage.value = getErrorMessage('unknown');
            return;
        }

        groceryList.value = groceryList.value.splice(groceryList.value.findIndex(ingredient => ingredient.id === ingredientId), 1);
    }

    
    /**
     * Delete the grocery list of the current user
     */
    async function deleteGroceryList(): Promise<void> {
        if (userStore.errorMessage) {
            errorMessage.value = userStore.errorMessage;
            return;
        }

        const { error } = await supabase
        .from('user_grocerylist')
        .delete()
        .eq('user_id', userStore.user?.id);

        if (error) {
            errorMessage.value = getErrorMessage('unknown');
            return;
        }

        groceryList.value = [];
    }
    
  return {
    groceryList,
    errorMessage,
    getGroceryList,
    setGroceryListIngredient,
    setGroceryList,
    deleteGroceryListIngredient,
    deleteGroceryList
  };
});
