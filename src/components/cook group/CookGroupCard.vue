<template>
  <section class="title">
    <h3>
      {{
        cookGroup.name
          ? capitalizeFirstLetter(cookGroup.name)
          : $t('cookGroupsPage.personalCookGroup')
      }}
    </h3>
    <div v-if="cookGroup.owner === getAuth().currentUser?.uid" class="actions">
      <font-awesome-icon @click="editCookGroup(cookGroup)" class="edit" :icon="['fas', 'pen']" />
      <font-awesome-icon
        @click="((deleteCookGroupOpen = true), (editableCookGroup = cookGroup))"
        class="delete"
        :icon="['fas', 'trash']"
      />
    </div>
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
  <confirm-pop-up
    v-model:open-pop-up="deleteCookGroupOpen"
    :title="$t('cookGroupsPage.deleteCookGroup')"
    :section="$t('cookGroupsPage.confirmDelete')"
    :cancel="$t('cookGroupsPage.cancel')"
    :confirm="$t('cookGroupsPage.delete')"
    @confirm="updateCookGroup()"
  />
</template>

<script lang="ts" setup>
import type { CookGroup } from '@/utils/types/cookgroup';
import { capitalizeFirstLetter } from '@/utils/global/text';
import { getAuth } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { getData } from '@/utils/global/db';
import { where } from 'firebase/firestore';
import { setImage } from '@/utils/global/manageImage';
import ConfirmPopUp from '@/components/form/ConfirmPopUp.vue';
import { deleteCookGroup } from '@/utils/cook group/deleteCookGroup';

const props = defineProps<{
  cookGroup: CookGroup;
}>();

const emit = defineEmits<{
  (e: 'refresh-cook-groups'): void;
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

// Delete cook group
const deleteCookGroupOpen = ref<boolean>(false);

/**
 * Update cook group (delete)
 */
async function updateCookGroup(): Promise<void> {
  await deleteCookGroup(editableCookGroup.value?.id);
  deleteCookGroupOpen.value = false;
  editableCookGroup.value = undefined;
  emit('refresh-cook-groups');
}
</script>
