<template>
  <label :id="id">
    {{ label }}
    <div>
      <input
        :name="name"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        type="file"
        :disabled="disabled"
        accept="image/*"
        @change="uploadImage"
      />
      <img :src="previewImage" />
    </div>
  </label>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  ariaLabel: string;
  disabled?: boolean;
}>();

const previewImage = ref('');

/**
 * Upload image
 * @param event Upload event
 */
function uploadImage(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const image = target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      previewImage.value = reader.result as string;
    };
  }
}
</script>
