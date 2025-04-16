<template>
  <main class="addCookGroup">
    <article>
      <div class="header">
        <h2>{{ $t('addCookGroupPage.title') }}</h2>
        <h2>
          <font-awesome-icon @click="$emit('closePopUp')" :icon="['fas', 'xmark']" />
        </h2>
      </div>
      <input-field
        id="name"
        name="name"
        :label="$t('addCookGroupPage.name')"
        :placeholder="$t('addCookGroupPage.name')"
        :ariaLabel="$t('addCookGroupPage.ariaLabel.name')"
        type="text"
        :required="true"
        v-model:input="cookGroup.name"
      />
      <input-list
        id="memberEmails"
        :label="$t('addCookGroupPage.memberEmails')"
        v-model:items="cookGroup.members"
        v-slot="{ index }"
      >
        <input-field
          :name="'member email ' + index"
          :placeholder="$t('addCookGroupPage.memberEmails')"
          :ariaLabel="$t('addCookGroupPage.ariaLabel.memberEmails')"
          type="text"
          v-model:input="cookGroup.members[index].email"
          @input="addInputRow(cookGroup.members, index, { email: '' })"
        />
      </input-list>
      <error-message v-model:message="errorMessage" />
      <div class="footer">
        <button @click="closePopUp" type="button">
          {{ $t('addCookGroupPage.cancel') }}
        </button>
        <button @click.prevent="saveCookGroup" type="submit">
          {{ $t('addCookGroupPage.save') }}
        </button>
      </div>
    </article>
  </main>
</template>

<script lang="ts" setup>
import { capitalize, onMounted, ref } from 'vue';
import InputField from './form/InputField.vue';
import InputList from './form/InputList.vue';
import ErrorMessage from './form/ErrorMessage.vue';
import { addInputRow } from '@/utils/newRecipe/list';
import { validateCookGroup } from '@/utils/cookGroups/validateCookGroup';
import { emptyCookGroupMembers, type CookGroup, type Member } from '@/utils/types/cookgroup';
import { addData, updateData } from '@/utils/db';
import i18n from '@/i18n/index';
import { getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';

const props = defineProps<{
  cookGroup?: CookGroup;
}>();
const emit = defineEmits<{ closePopUp: []; refreshCookGroups: [] }>();

const auth = getAuth();

const cookGroup = ref<CookGroup>(emptyCookGroupMembers());
const errorMessage = ref<string>('');

// Add cook group to edit if it exists
onMounted(() => {
  if (props.cookGroup) {
    cookGroup.value = JSON.parse(JSON.stringify(props.cookGroup));
    cookGroup.value.name = capitalize(cookGroup.value.name);
    cookGroup.value.members = [...cookGroup.value.members, { userId: '', email: '' }];
  }
});

/**
 * Save the new cook group
 * @returns {Promise<void>} - A promise that resolves when the cook group is saved
 */
async function saveCookGroup(): Promise<void> {
  errorMessage.value = validateCookGroup(cookGroup.value);
  const members = cookGroup.value.members.filter((member) => member.email !== '');
  if (errorMessage.value === '') {
    if (!props.cookGroup) {
      cookGroup.value.id = crypto.randomUUID();
      cookGroup.value.owner = auth.currentUser?.uid || '';
      cookGroup.value.personal = false;
    }
    cookGroup.value.name = cookGroup.value.name.toLowerCase();
    cookGroup.value.members = [
      ...new Set(
        members.map((member) => ({
          userId: '',
          email: member.email.toLowerCase()
        })) as Member[]
      )
    ];

    // Save the cook group to the database
    try {
      // Check if the user is editing an existing cook group
      if (props.cookGroup) {
        await updateData('cookGroups', where('id', '==', cookGroup.value.id), cookGroup.value);
      } else {
        await addData('cookGroups', cookGroup.value);
      }

      // Reset the form
      cookGroup.value = emptyCookGroupMembers();
      errorMessage.value = '';

      // Emit the event to close the pop-up
      emit('refreshCookGroups');
      emit('closePopUp');
    } catch (error) {
      errorMessage.value = i18n.global.t('addCookGroupPage.errors.save');
    }
  }
}

/**
 * Close the pop-up and reset the form
 */
function closePopUp(): void {
  emit('closePopUp');
  cookGroup.value = emptyCookGroupMembers();
  errorMessage.value = '';
}
</script>
