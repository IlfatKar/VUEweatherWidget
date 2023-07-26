<template>
  <a-layout class="mainLayout" v-for="[key, value] in cities" :key="key">
    <WeatherBlock
      :title="key"
      v-if="value"
      :info="value"
      :show-gear="true"
      :type="WeatherBlockTypes.big"
    />
  </a-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fetchWeather } from "../shared/api/fetchWeather";
import WeatherBlock from "../entities/WeatherBlock/WeatherBlock.vue";
import { ICitiesInfo } from "./types";
import { WeatherBlockTypes } from "@/entities/WeatherBlock/types";

const cities = ref<ICitiesInfo>(new Map());
cities.value.set("London", null);
onMounted(() => {
  for (const key of cities.value.keys()) {
    fetchWeather(key).then((data) => {
      cities.value.set(key, {
        description: data.weather[0].description,
        temp: data.main.temp,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility,
        wind: { deg: data.wind.deg, speed: data.wind.speed },
        icon: data.weather[0].icon,
        name: data.name,
        feelsLike: data.main.feels_like,
      });
    });
  }
});
</script>

<style lang="scss">
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  max-width: 320px;
}
.mainLayout {
  background-color: #fff;
}
</style>
