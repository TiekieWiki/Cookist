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
      <article class="card">
        <div class="title">
          <h3>{{ $t('cookGroupsPage.personalCookGroup') }}</h3>
        </div>
        <div class="info">
          <p>{{ 1 }} {{ true ? $t('cookGroupsPage.recipes') : $t('cookGroupsPage.recipe') }}</p>
        </div>
      </article>
      <article v-for="cookGroup in cookGroups" :key="cookGroup.id" class="card" :id="cookGroup.id">
        <div class="title">
          <h3>{{ capitalizeFirstLetter(cookGroup.name) }}</h3>
          <font-awesome-icon
            v-if="cookGroup.owner === getAuth().currentUser?.uid"
            @click="editCookGroup(cookGroup)"
            class="editCookGroup"
            :icon="['fas', 'pen']"
          />
        </div>
        <div class="info">
          <p>{{ 1 }} {{ true ? $t('cookGroupsPage.recipes') : $t('cookGroupsPage.recipe') }}</p>
          <p>
            {{ cookGroup.members.length }}
            {{
              cookGroup.members.length > 1
                ? $t('cookGroupsPage.members')
                : $t('cookGroupsPage.member')
            }}
          </p>
        </div>
      </article>
    </template>
    <article class="card newCookGroup">
      <button @click="addCookGroupOpen = !addCookGroupOpen" type="button">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>
    </article>
  </main>
  <AddCookGroup
    v-if="addCookGroupOpen"
    :cook-group="editableCookGroup"
    @close-pop-up="closePopUp()"
    @refresh-cook-groups="getCookGroups()"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import AddCookGroup from '@/components/AddCookGroup.vue';
import type { CookGroup } from '@/utils/types/cookgroup';
import { getData } from '@/utils/db';
import { getQueryCookGroups } from '@/utils/cookGroups/queryCookGroups';
import { capitalizeFirstLetter } from '@/utils/text';
import { getAuth } from 'firebase/auth';

const cookGroups = ref<CookGroup[]>([]);
const noCookGroups = ref<boolean>(true);
const addCookGroupOpen = ref<boolean>(false);
const editableCookGroup = ref<CookGroup | undefined>(undefined);

// Get cook groups
onMounted(async () => {
  await getCookGroups();
});

/**
 * Get cook groups from the database
 * @returns {Promise<void>} - A promise that resolves when the cook groups are fetched
 */
async function getCookGroups(): Promise<void> {
  try {
    cookGroups.value = (await getData('cookGroups', getQueryCookGroups())) as CookGroup[];
    noCookGroups.value = false;
  } catch (error) {
    noCookGroups.value = true;
  }
}

/**
 * Edit cook group
 * @returns {void}
 */
function editCookGroup(cookGroup: CookGroup): void {
  addCookGroupOpen.value = true;
  editableCookGroup.value = cookGroup;
}

/**
 * Close the pop up
 * @returns {void}
 */
function closePopUp(): void {
  addCookGroupOpen.value = false;
  editableCookGroup.value = undefined;
}
</script>
