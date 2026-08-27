<template>
  <section class="card">
    <TextArea
      id="notes"
      name="notes"
      :label="$t('editRecipePage.notes')"
      :placeholder="$t('editRecipePage.placeholder.notes')"
      :ariaLabel="$t('editRecipePage.ariaLabel.notes')"
      v-model:input="notes"
    />
    <UploadImage
      id="image"
      name="image"
      :label="$t('editRecipePage.image')"
      :placeholder="$t('editRecipePage.placeholder.image')"
      :ariaLabel="$t('editRecipePage.ariaLabel.image')"
      :oldImage="image as string"
      @image="(i: File | null) => (image = i)"
    />
  </section>
</template>

<script setup lang="ts">
import TextArea from '@/components/form/TextArea.vue';
import UploadImage from '@/components/form/UploadImage.vue';

const notes = defineModel<string>('notes');
const image = defineModel<File | string | null>('image', { required: true });
</script>
