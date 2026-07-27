<template>
  <label :for="id">
    {{ required ? label + ' *' : label }}
    <div>
      <input
        :class="variant"
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
import { ColorVariant } from '@/utils/types/enums';
import { UploadImageProps } from '@/utils/types/form';
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<UploadImageProps>(), {
  variant: ColorVariant.PRIMARY
});

const emit = defineEmits<{ image: [File] }>();

const previewImage = ref<string>('');

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
  () => {
    if (props.oldImage) {
      previewImage.value = props.oldImage;
    }
  },
  { immediate: true }
);
</script>
