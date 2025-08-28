<template>
  <label :for="id">
    {{ required ? label + ' *' : label }}
    <div>
      <input
        :id="id"
        :name="name"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        type="file"
        :disabled="disabled"
        accept="image/*"
        @change="showImagePreview"
      />
      <Transition name="fade">
        <img :src="previewImage" :alt="$t('editRecipePage.alt.previewImage')" v-if="previewImage" />
      </Transition>
    </div>
  </label>
</template>

<script setup lang="ts">
import { getImage } from '@/utils/global/manageImage';
import { ref, watch } from 'vue';

const props = defineProps<{
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  ariaLabel: string;
  required?: boolean;
  disabled?: boolean;
  oldImage?: string;
}>();

const emit = defineEmits<{ image: [File] }>();

const previewImage = ref('');

/**
 * Show image
 * @param event Upload event
 */
function showImagePreview(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const image = target.files[0];
    emit('image', image);
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      previewImage.value = reader.result as string;
    };
  }
}

// Set preview image to the image prop
watch(
  () => props.oldImage,
  (newImage) => {
    if (newImage) {
      getImage(newImage)
        .then((url) => {
          previewImage.value = url;
        })
        .catch((error) => {
          console.error('Error getting preview image:', error);
          previewImage.value = '';
        });
    }
  },
  { immediate: true }
);
</script>
