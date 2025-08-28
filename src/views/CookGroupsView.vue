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
    <article v-if="cookGroups.length <= 0" class="noCards">
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
import { ref } from 'vue';
import NewCookGroup from '@/components/cook group/NewCookGroup.vue';
import type { CookGroup } from '@/utils/types/cookgroup';
import { getCookGroups } from '@/utils/cook group/getCookGroups';
import CookGroupCard from '@/components/cook group/CookGroupCard.vue';
import { capitalizeFirstLetter } from '@/utils/global/text';
import { useCookGroup } from '@/composables/useCookGroup';

// Cook groups
const { cookGroups, cookGroupInvites, acceptInvite, declineInvite } = useCookGroup();

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
