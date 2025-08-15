<template>
  <section class="title">
    <h3>
      {{
        cookGroup.name
          ? capitalizeFirstLetter(cookGroup.name)
          : $t('cookGroupsPage.personalCookGroup')
      }}
    </h3>
    <font-awesome-icon
      v-if="cookGroup.owner === getAuth().currentUser?.uid"
      @click="editCookGroup(cookGroup)"
      class="edit"
      :icon="['fas', 'pen']"
    />
  </section>
  <section class="info">
    <p>
      {{ cookGroupRecipesCount }}
      {{ $t('cookGroupsPage.recipes', cookGroupRecipesCount ?? 0) }}
    </p>
    |
    <p>
      {{ cookGroup.members.length + 1 }}
      {{ $t('cookGroupsPage.members', cookGroup.members.length + 1) }}
    </p>
  </section>
</template>

<script lang="ts" setup>
import type { CookGroup } from '@/utils/types/cookgroup';
import { capitalizeFirstLetter } from '@/utils/text';
import { getAuth } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { getData } from '@/utils/db';
import { where } from 'firebase/firestore';
import { setImage } from '@/utils/manageImage';

const props = defineProps<{
  cookGroup: CookGroup;
}>();

const editCookGroupOpen = defineModel<boolean>('editCookGroupOpen', { required: true });
const editableCookGroup = defineModel<CookGroup | undefined>('editableCookGroup', {
  required: true
});

const cookGroupRecipesCount = ref<number>();

onMounted(() => {
  // Get cook group recipes if they exist
  getData('cookGroupRecipes', where('cookGroupId', '==', props.cookGroup.id))
    .then((cookGroupRecipes) => {
      cookGroupRecipesCount.value = cookGroupRecipes.length;

      // Set the cook group to image of containing recipes
      if (cookGroupRecipes.length > 0) {
        setImage(cookGroupRecipes[0].cookGroupId, cookGroupRecipes[0].image);
      }
    })
    .catch((error) => {
      setImage(props.cookGroup.id, '');
      console.error('Error getting cook group recipes from database:', error);
    });
});

/**
 * Edit cook group
 */
function editCookGroup(cookGroup: CookGroup): void {
  editCookGroupOpen.value = true;
  editableCookGroup.value = cookGroup;
}
</script>
