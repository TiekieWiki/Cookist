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
        @change="showImagePreview"
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

const emit = defineEmits(['image']);

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
</script>
