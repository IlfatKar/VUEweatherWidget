<template>
  <div class="grid">
    <a-row align="middle">
      <a-col :span="props.showGear ? 12 : 24">
        <a-typography-title :level="3">
          {{ props.info.name }}
        </a-typography-title>
      </a-col>
      <a-col align="right" v-if="props.showGear" :span="12">
        <setting-outlined :class="'gear'" @click="openSettings" />
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" align="middle">
      <a-col :span="12" align="right">
        <img
          :src="`https://openweathermap.org/img/wn/${props.info.icon}@2x.png`"
        />
      </a-col>
      <a-col :span="12">
        <a-typography-text :class="'temp'">
          {{ props.info.temp }}°C
        </a-typography-text>
      </a-col>
    </a-row>

    <DescriptionItem
      v-if="props.type > 1"
      :items="[
        {
          text: `Feels like ${props.info.feelsLike}°C`,
        },
        {
          text:
            props.info.description.slice(0, 1).toUpperCase() +
            props.info.description.slice(1),
        },
      ]"
    />
    <DescriptionItem
      v-if="props.type > 2"
      :items="[
        {
          icon: { type: 'wind', rotate: props.info.wind.deg },
          text: `${props.info.wind.speed}m/s`,
        },
        { icon: { type: 'pressure' }, text: `${props.info.pressure}hPa` },
      ]"
    />
    <DescriptionItem
      v-if="props.type > 2"
      :items="[
        { text: `Humidility: ${props.info.humidity}%` },
        { text: `Visibility: ${props.info.visibility}km` },
      ]"
    />
  </div>
</template>
<script setup lang="ts">
import DescriptionItem from "@/features/DescriptionItem/DescriptionItem.vue";
import { IWeatherInfo } from "@/shared/types";
import { WeatherBlockTypes } from "./types";
import { SettingOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  info: IWeatherInfo;
  type: WeatherBlockTypes;
  showGear?: boolean;
  openSettings?: () => void;
}>();
</script>

<style lang="scss" scoped>
.grid {
  padding: 14px;
  .temp {
    font-size: 28px;
    font-weight: 600;
  }
  .gear {
    cursor: pointer;
    transform: scale(2) translateX(-3px);
  }
}
</style>
