<template>
  <main class="cookGroups">
    <article>
      <Transition name="fade">
        <section v-if="cookGroupInvites.length > 0" class="card">
          <h3>{{ $t('cookGroupsPage.invites') }}</h3>
          <TransitionGroup name="fade" tag="ul">
            <li v-for="invite in cookGroupInvites" :key="invite.id">
              <p>{{ capitalizeFirstLetter(invite.name) }}</p>
              <div class="actions">
                <Button @click="acceptInvite(invite.id)" :type="ButtonType.BUTTON">
                  <font-awesome-icon :icon="['fas', 'check']" />
                </Button>
                <Button @click="declineInvite(invite.id)" :type="ButtonType.SUBMIT" :variant="ColorVariant.WARNING">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </Button>
              </div>
            </li>
          </TransitionGroup>
        </section>
      </Transition>
      <div class="cookGroupList">
        <section class="card" :class="ColorVariant.ACCENT">
          <div class="header">
            <h2>{{ $t('cookGroupsPage.title') }}</h2>
            <div class="actions align">
              <Button @click="editCookGroupOpen = !editCookGroupOpen" :type="ButtonType.BUTTON" :icon-only="true">
                <font-awesome-icon :icon="['fas', 'plus']" />
              </Button>
            </div>
          </div>
        </section>
        <CookGroupCard v-for="cookGroup in cookGroups" :key="cookGroup.id""
          :cook-group="cookGroup"
          v-model:edit-cook-group-open="editCookGroupOpen"
          v-model:editable-cook-group="editableCookGroup"
          @refresh-cook-groups="getCookGroups()"
        />
      </div>
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
import { ButtonType, ColorVariant } from '@/utils/types/enums';

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
