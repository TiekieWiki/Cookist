<template>
  <section class="card">
    <InputList
      id="instructions"
      :label="$t('editRecipePage.instructions')"
      :required="true"
      :colAmount="ColAmount.TWO"
      v-model:items="instructions"
      v-slot="{ index }"
    >
      <InputField
        :name="'instruction ' + index"
        :placeholder="$t('editRecipePage.placeholder.instruction')"
        :ariaLabel="$t('editRecipePage.ariaLabel.instruction')"
        type="text"
        v-model:input="instructions[index].instruction"
        @input="addInputRow(instructions, index, { sort_order: index, instruction: '' })"
      />
    </InputList>
  </section>
</template>

<script setup lang="ts">
import { Instruction, type Recipe } from '@/utils/types/recipe';
import { addInputRow } from '@/utils/global/list';
import InputField from '@/components/form/InputField.vue';
import InputList from '@/components/form/InputList.vue';
import { ColAmount } from '@/utils/types/enums';

const instructions = defineModel<Instruction[]>('instructions', { required: true });
const save = defineEmits<{ save: [boolean] }>();
</script>
