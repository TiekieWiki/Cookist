<template>
  <main class="cookGroups two-columns">
    <article>
      <div class="header">
        <h2>{{ $t('cookGroupsPage.title') }}</h2>
      </div>
    </article>
    <article v-if="noCookGroups" class="noCookGroups">
      <h3>{{ $t('cookGroupsPage.noCookGroups') }}</h3>
    </article>
    <template v-else>
      <article v-for="cookGroup in cookGroups" :key="cookGroup.id" class="card" :id="cookGroup.id">
        <cook-group-card
          :cookGroup="cookGroup"
          :editCookGroupOpen="editCookGroupOpen"
          :editableCookGroup="editableCookGroup"
          @update:edit-cook-group-open="(e) => (editCookGroupOpen = e)"
          @update:editable-cook-group="(e) => (editableCookGroup = e)"
        />
      </article>
    </template>
    <article class="card newCookGroup">
      <button @click="editCookGroupOpen = !editCookGroupOpen" type="button">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>
    </article>
  </main>
  <new-cook-group
    v-if="editCookGroupOpen"
    :cook-group="editableCookGroup"
    @close-pop-up="closePopUp()"
    @refresh-cook-groups="getCookGroups()"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import NewCookGroup from '@/components/cook group/NewCookGroup.vue';
import type { CookGroup } from '@/utils/types/cookgroup';
import { getData } from '@/utils/db';
import { getQueryCookGroups } from '@/utils/cook group/queryCookGroups';
import { getAuth } from 'firebase/auth';
import CookGroupCard from '@/components/cook group/CookGroupCard.vue';

const auth = getAuth();

// Get cook groups
const cookGroups = ref<CookGroup[]>([]);
const noCookGroups = ref<boolean>(true);

// Get cook groups
onMounted(async () => {
  await getCookGroups();
});

/**
 * Get cook groups from the database
 * @returns {Promise<void>} A promise that resolves when the cook groups are fetched
 */
async function getCookGroups(): Promise<void> {
  try {
    cookGroups.value = (await getData(
      'cookGroups',
      getQueryCookGroups(auth.currentUser?.uid || '')
    )) as CookGroup[];

    // Sort the cook groups by personal first, then by name
    cookGroups.value.sort((a, b) => {
      if (a.personal && !b.personal) return -1;
      if (!a.personal && b.personal) return 1;
      return a.name.localeCompare(b.name);
    });

    noCookGroups.value = false;
  } catch (error) {
    console.error(error);
    noCookGroups.value = true;
  }
}

// Edit cook group
const editCookGroupOpen = ref<boolean>(false);
const editableCookGroup = ref<CookGroup | undefined>(undefined);

/**
 * Close the pop up
 */
function closePopUp(): void {
  editCookGroupOpen.value = false;
  editableCookGroup.value = undefined;
}
</script>
