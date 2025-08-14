<template>
  <main class="cookGroups two-columns">
    <article>
      <section class="header">
        <h2>{{ $t('cookGroupsPage.title') }}</h2>
      </section>
    </article>
    <article v-if="cookGroupInvites.length > 0" class="invites noCards">
      <h3>{{ $t('cookGroupsPage.invites') }}</h3>
      <ul class="list">
        <li v-for="invite in cookGroupInvites" :key="invite.id">
          <p>{{ capitalizeFirstLetter(invite.name) }}</p>
          <div class="actions">
            <button @click="acceptInvite(invite.id)" class="edit" type="button">
              <font-awesome-icon :icon="['fas', 'check']" />
            </button>
            <button @click="declineInvite(invite.id)" class="delete" type="button">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </div>
        </li>
      </ul>
    </article>
    <article v-if="noCookGroups" class="noCards">
      <h3>{{ $t('cookGroupsPage.noCookGroups') }}</h3>
    </article>
    <template v-else>
      <article v-for="cookGroup in cookGroups" :key="cookGroup.id" class="card" :id="cookGroup.id">
        <cook-group-card
          :cook-group="cookGroup"
          v-model:edit-cook-group-open="editCookGroupOpen"
          v-model:editable-cook-group="editableCookGroup"
        />
      </article>
    </template>
    <article class="card newCard">
      <button @click="editCookGroupOpen = !editCookGroupOpen" type="button">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </button>
    </article>
  </main>
  <teleport to="body" v-if="editCookGroupOpen">
    <new-cook-group
      :cook-group="editableCookGroup"
      @close-pop-up="closePopUp()"
      @refresh-cook-groups="getCookGroups()"
    />
  </teleport>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import NewCookGroup from '@/components/cook group/NewCookGroup.vue';
import type { CookGroup } from '@/utils/types/cookgroup';
import { getData, updateData } from '@/utils/db';
import { getQueryCookGroups } from '@/utils/cook group/queryCookGroups';
import { getAuth } from 'firebase/auth';
import CookGroupCard from '@/components/cook group/CookGroupCard.vue';
import { sortCookGroups } from '@/utils/cook group/sort';
import { where } from 'firebase/firestore';
import { capitalizeFirstLetter } from '@/utils/text';

const auth = getAuth();

// Get cook groups
const cookGroups = ref<CookGroup[]>([]);
const noCookGroups = ref<boolean>(true);
const cookGroupInvites = ref<CookGroup[]>([]);

// Get cook groups
onMounted(async () => {
  await getCookGroups();

  // Get cook group invites
  await getData('cookGroups', where('invitees', 'array-contains', auth.currentUser?.email || ''))
    .then((invitees) => {
      if (invitees.length > 0) {
        cookGroupInvites.value = invitees as CookGroup[];
      }
    })
    .catch((error) => {
      console.error('Error getting cook group invites from database:', error);
    });
});

/**
 * Get cook groups from the database
 * @returns {Promise<void>} A promise that resolves when the cook groups are fetched
 */
async function getCookGroups(): Promise<void> {
  getData('cookGroups', getQueryCookGroups(auth.currentUser?.uid || ''))
    .then((data) => {
      cookGroups.value = sortCookGroups(data as CookGroup[]);
      noCookGroups.value = false;
    })
    .catch((error) => {
      console.error('Error getting cook groups from database:', error);
      noCookGroups.value = true;
    });
}

// Invites
/**
 * Accept a cook group invite
 * @param {string} cookGroupId - The ID of the cook group to accept the invite for
 * @returns {Promise<void>} A promise that resolves when the invite is accepted
 */
async function acceptInvite(cookGroupId: string): Promise<void> {
  const invite = cookGroupInvites.value.find((invite) => invite.id === cookGroupId);
  if (invite) {
    invite.members = [...invite.members, auth.currentUser?.uid || ''];
    invite.invitees = invite.invitees.filter((email) => email !== auth.currentUser?.email);
    updateData('cookGroups', where('id', '==', cookGroupId), invite)
      .then(() => {
        // Refresh cook groups and invites
        getCookGroups();
        cookGroupInvites.value = cookGroupInvites.value.filter((i) => i.id !== cookGroupId);
      })
      .catch((error) => {
        console.error('Error accepting cook group invite:', error);
      });
  } else {
    console.error('Invite not found for cook group ID:', cookGroupId);
  }
}

/**
 * Decline a cook group invite
 * @param {string} cookGroupId - The ID of the cook group to decline the invite for
 * @returns {Promise<void>} A promise that resolves when the invite is declined
 */
async function declineInvite(cookGroupId: string): Promise<void> {
  const invite = cookGroupInvites.value.find((invite) => invite.id === cookGroupId);
  if (invite) {
    invite.invitees = invite.invitees.filter((email) => email !== auth.currentUser?.email);
    updateData('cookGroups', where('id', '==', cookGroupId), invite)
      .then(() => {
        // Refresh cook groups and invites
        getCookGroups();
        cookGroupInvites.value = cookGroupInvites.value.filter((i) => i.id !== cookGroupId);
      })
      .catch((error) => {
        console.error('Error declining cook group invite:', error);
      });
  } else {
    console.error('Invite not found for cook group ID:', cookGroupId);
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
