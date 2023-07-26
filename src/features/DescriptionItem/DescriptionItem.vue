<template>
  <a-row class="DescriptionItem">
    <a-col
      :span="24 - props.items.length * 6"
      v-for="(item, index) in props.items"
      :key="index"
      align="middle"
    >
      <a-row align="middle">
        <a-space>
          <arrow-right-outlined
            v-if="item.icon?.type === 'wind'"
            :rotate="item.icon.rotate || 0"
          />
          <dashboard-outlined v-else-if="item.icon?.type === 'pressure'" />
          <a-typography-text>{{ item.text }}</a-typography-text>
        </a-space>
      </a-row>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ArrayOfMaxItems } from "./types/index";
import { ArrowRightOutlined, DashboardOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  items: ArrayOfMaxItems;
}>();
</script>

<style lang="scss" scoped>
.DescriptionItem {
  margin-top: 12px;
  .ant-space {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
