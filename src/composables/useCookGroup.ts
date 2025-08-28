import { getCookGroups } from '@/utils/cook group/getCookGroups';
import { getData, updateData } from '@/utils/global/db';
import type { CookGroup } from '@/utils/types/cookgroup';
import { getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { onMounted, ref } from 'vue';

/**
 * Composable for managing cook groups and invites
 * @returns {object} An object containing cook groups, invites, and functions to accept/decline invites
 */
export function useCookGroup() {
  const cookGroups = ref<CookGroup[]>([]);
  const cookGroupInvites = ref<CookGroup[]>([]);

  // Get cook groups
  onMounted(async () => {
    cookGroups.value = (await getCookGroups()).cookGroups;

    // Get cook group invites
    await getData(
      'cookGroups',
      where('invitees', 'array-contains', getAuth().currentUser?.email || '')
    )
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
   * Accept a cook group invite
   * @param {string} cookGroupId - The ID of the cook group to accept the invite for
   * @returns {Promise<void>} A promise that resolves when the invite is accepted
   */
  async function acceptInvite(cookGroupId: string): Promise<void> {
    const invite = cookGroupInvites.value.find((invite) => invite.id === cookGroupId);
    if (invite) {
      invite.members = [...invite.members, getAuth().currentUser?.uid || ''];
      invite.invitees = invite.invitees.filter((email) => email !== getAuth().currentUser?.email);
      updateData('cookGroups', where('id', '==', cookGroupId), invite)
        .then(async () => {
          // Refresh cook groups and invites
          cookGroups.value = (await getCookGroups()).cookGroups;
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
      invite.invitees = invite.invitees.filter((email) => email !== getAuth().currentUser?.email);
      updateData('cookGroups', where('id', '==', cookGroupId), invite)
        .then(async () => {
          // Refresh cook groups and invites
          cookGroups.value = (await getCookGroups()).cookGroups;
          cookGroupInvites.value = cookGroupInvites.value.filter((i) => i.id !== cookGroupId);
        })
        .catch((error) => {
          console.error('Error declining cook group invite:', error);
        });
    } else {
      console.error('Invite not found for cook group ID:', cookGroupId);
    }
  }

  return {
    cookGroups,
    cookGroupInvites,
    acceptInvite,
    declineInvite
  };
}
