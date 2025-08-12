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
      {{ cookGroupRecipesCount == 1 ? $t('cookGroupsPage.recipe') : $t('cookGroupsPage.recipes') }}
    </p>
    <p>
      {{ cookGroup.members.length }}
      {{
        cookGroup.members.length == 1 ? $t('cookGroupsPage.member') : $t('cookGroupsPage.members')
      }}
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
    .then((data) => {
      cookGroupRecipesCount.value = data.length;
    })
    .catch((error) => {
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
