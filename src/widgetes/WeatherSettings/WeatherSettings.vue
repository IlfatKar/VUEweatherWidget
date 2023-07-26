<template>
  <div class="WeatherSettings" :class="{ open: props.isOpen }">
    <a-row align="middle" justify="space-between">
      <a-col :span="12">
        <a-typography-title :level="3">Settings</a-typography-title>
      </a-col>
      <a-col :span="12" align="right" class="close"
        ><close-outlined @click="props.onClose"
      /></a-col>
    </a-row>
    <a-col :span="24" class="menu">
      <a-col :span="24" class="citiesList" @dragover="dragover" @dragend="drop">
        <SettingsItem
          v-for="city in props.cities"
          :key="city"
          :city="city"
          :on-delete="() => onDeleteCity(city)"
          @dragstart="drag"
          :is-dragged="selectedCity === city"
        />
      </a-col>
      <AddLocation :add-city="props.addCity" />
    </a-col>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import AddLocation from "../../features/AddLocation/AddLocation.vue";
import SettingsItem from "../../features/SettingsItem/SettingsItem.vue";
import { CloseOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  isOpen: boolean;
  onClose: () => void;
  onDeleteCity: (city: string) => void;
  cities: string[];
  addCity: (city: string, completeLoad: () => void) => void;
  swapCities: (idx1: number, idx2: number) => void;
}>();

const selected = ref<HTMLDivElement | null>(null);
const selectedCity = ref<string | null>(null);

const drag = (e: DragEvent) => {
  if (e) {
    const el: HTMLDivElement | null = (e.target as HTMLSpanElement).closest(
      "[city]"
    );
    const c = el?.getAttribute("city");
    if (c) {
      selected.value = el;
      selectedCity.value = c;
    }
  }
};
const dragover = (e: DragEvent) => {
  if (selected.value) {
    const el: HTMLDivElement | null = (e.target as HTMLSpanElement).closest(
      "[city]"
    );
    const c = el?.getAttribute("city");

    if (c) {
      const idxCurrent = props.cities.findIndex((item) => item === c);
      const idxSelected = props.cities.findIndex(
        (item) => item === selectedCity.value
      );
      if (
        idxCurrent !== -1 &&
        idxSelected !== -1 &&
        idxCurrent !== idxSelected
      ) {
        props.swapCities(idxCurrent, idxSelected);
      }
    }
  }
};
const drop = (e: DragEvent) => {
  selected.value = null;
  selectedCity.value = null;
};
</script>

<style lang="scss" scoped>
.WeatherSettings {
  background-color: #fafafa;
  position: absolute;
  padding: 14px;
  width: 100%;
  height: 100%;
  right: 0;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.35s;
  max-height: 600px;

  &.open {
    transform: translateX(0);
    opacity: 1;
  }
  .close {
    cursor: pointer;
    transform: scale(2) translateX(-35px);
  }

  .menu {
    position: relative;
    height: calc(100% - 44px);
    .citiesList {
      max-height: calc(100% - 44px - 14px * 2);
      overflow: auto;
      & > div {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
