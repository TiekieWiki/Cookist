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
    <p>{{ 1 }} {{ true ? $t('cookGroupsPage.recipes') : $t('cookGroupsPage.recipe') }}</p>
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

defineProps<{
  cookGroup: CookGroup;
}>();

const editCookGroupOpen = defineModel<boolean>('editCookGroupOpen', { required: true });
const editableCookGroup = defineModel<CookGroup | undefined>('editableCookGroup', {
  required: true
});

/**
 * Edit cook group
 */
function editCookGroup(cookGroup: CookGroup): void {
  editCookGroupOpen.value = true;
  editableCookGroup.value = cookGroup;
}
</script>
