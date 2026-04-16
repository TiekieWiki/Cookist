<template>
  <main :class="['cookGroups', 'two-columns', cookGroupInvites.length > 0 ? 'two-headers' : '']">
    <article>
      <section class="header">
        <h2>{{ $t('cookGroupsPage.title') }}</h2>
      </section>
    </article>
    <Transition name="fade">
      <article v-if="cookGroupInvites.length > 0" class="invites noCards">
        <h3>{{ $t('cookGroupsPage.invites') }}</h3>
        <TransitionGroup name="fade" tag="ul" class="list">
          <li v-for="invite in cookGroupInvites" :key="invite.id">
            <p>{{ capitalizeFirstLetter(invite.name) }}</p>
            <div class="actions">
              <Button @click="acceptInvite(invite.id)" :type="ButtonType.BUTTON">
                <font-awesome-icon :icon="['fas', 'check']" />
              </Button>
              <Button @click="declineInvite(invite.id)" :type="ButtonType.SUBMIT">
                <font-awesome-icon :icon="['fas', 'trash']" />
              </Button>
            </div>
          </li>
        </TransitionGroup>
      </article>
    </Transition>
    <article v-if="cookGroups.length <= 0" class="noCards">
      <h3>{{ $t('cookGroupsPage.noCookGroups') }}</h3>
    </article>
    <template v-else>
      <article v-for="cookGroup in cookGroups" :key="cookGroup.id" class="card" :id="cookGroup.id">
        <CookGroupCard
          :cook-group="cookGroup"
          v-model:edit-cook-group-open="editCookGroupOpen"
          v-model:editable-cook-group="editableCookGroup"
          @refresh-cook-groups="getCookGroups()"
        />
      </article>
    </template>
    <article class="card newCard">
      <Button @click="editCookGroupOpen = !editCookGroupOpen" :type="ButtonType.BUTTON">
        <font-awesome-icon :icon="['fas', 'plus']" />
      </Button>
    </article>
  </main>
  <teleport to="body" v-if="editCookGroupOpen">
    <NewCookGroup
      :cook-group="editableCookGroup"
      @close-pop-up="closePopUp()"
      @refresh-cook-groups="getCookGroups()"
    />
  </teleport>
</template>

<script lang="ts" setup>
import { ref, TransitionGroup } from 'vue';
import NewCookGroup from '@/components/cook group/NewCookGroup.vue';
import type { CookGroup } from '@/utils/types/cookgroup';
import { getCookGroups } from '@/utils/cook group/getCookGroups';
import CookGroupCard from '@/components/cook group/CookGroupCard.vue';
import { capitalizeFirstLetter } from '@/utils/global/text';
import { useCookGroup } from '@/composables/useCookGroup';
import Button from '@/components/form/Button.vue';
import { ButtonType } from '@/utils/types/enums';

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
