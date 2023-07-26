<template>
  <a-row
    align="middle"
    :city="props.city"
    class="SettingsItem"
    justify="space-between"
    :class="{ isDragged: props.isDragged }"
  >
    <a-space>
      <holder-outlined
        class="holder"
        draggable="true"
        @dragstart="$emit('dragstart')"
      />
      <a-typography-text>{{ props.city }}</a-typography-text>
    </a-space>
    <delete-outlined @click="onDelete" class="delete" />
  </a-row>
</template>
<script setup lang="ts">
import {
  HolderOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue/lib/icons";
const props = defineProps<{
  city: string;
  onDelete: () => void;
  isDragged: boolean;
}>();
</script>
<style lang="scss" scoped>
.SettingsItem {
  background-color: #f1f1f1;
  width: 100%;
  padding: 8px;

  &.isDragged {
    opacity: 0.5;
  }
  .holder {
    cursor: grab;
  }
  .delete {
    cursor: pointer;
  }
}
</style>
