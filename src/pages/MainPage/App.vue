<template>
  <a-layout class="mainLayout">
    <a-space direction="vertical">
      <div v-for="(item, index) in citiesList" :key="item[0]">
        <WeatherBlock
          :title="cities.get(item)"
          v-if="cities.get(item)"
          :open-settings="
            index === 0
              ? () => {
                  isSettingsOpen = true;
                }
              : undefined
          "
          :info="cities.get(item)!"
          :show-gear="index === 0"
          :type="WeatherBlockTypes.big"
        />
      </div>
    </a-space>
    <WeatherSettings
      :cities="citiesList"
      :on-close="
        () => {
          isSettingsOpen = false;
        }
      "
      :is-open="isSettingsOpen"
      :on-delete-city="deleteCity"
      :add-city="addCity"
      :swap-cities="swapCities"
    />
  </a-layout>
  <contextHolder />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fetchWeather } from "../../shared/api/fetchWeather";
import WeatherBlock from "../../widgetes/WeatherBlock/WeatherBlock.vue";
import WeatherSettings from "../../widgetes/WeatherSettings/WeatherSettings.vue";
import { ICitiesInfo } from "./types";
import { WeatherBlockTypes } from "@/widgetes/WeatherBlock/types";
import { parseWeatherResponce, swapArrayElements } from "./helpers/index";
import { notification } from "ant-design-vue";
import {
  IWeatherResponceError,
  IWeatherResponce,
} from "../../shared/api/types/index";
const [notificationApi, contextHolder] = notification.useNotification();

const cities = ref<ICitiesInfo>(new Map());
cities.value.set("London", null);
cities.value.set("Moscow", null);
const citiesList = ref<string[]>(Array.from(cities.value.keys()));
const isSettingsOpen = ref<boolean>(false);

const deleteCity = (city: string) => {
  if (citiesList.value.length <= 1) {
    notificationApi.error({
      message: "Error",
      description: `You can't delete the last element`,
    });
    return;
  }
  citiesList.value = citiesList.value.filter((item) => item !== city);
  cities.value.delete(city);
  isSettingsOpen.value = false;
};

const addCity = (city: string, completeLoad: () => void) => {
  fetchWeatherWrapper(city).then(() => {
    completeLoad();
  });
};

const swapCities = (idx1: number, idx2: number) => {
  swapArrayElements(citiesList.value, idx1, idx2);
};

const isError = (
  data: IWeatherResponceError | IWeatherResponce
): data is IWeatherResponceError => {
  return (data as IWeatherResponceError).message !== undefined;
};

const fetchWeatherWrapper = async (key: string) => {
  return fetchWeather(key)
    .then((data) => {
      if (isError(data)) {
        throw new Error(data.message);
      }
      cities.value.set(key, parseWeatherResponce(data));
      citiesList.value.push(key);
    })
    .catch((e: Error) => {
      notificationApi.error({
        message: "Weather fetching error",
        description: e.message,
      });
    });
};

onMounted(() => {
  citiesList.value = [];
  for (const key of cities.value.keys()) {
    fetchWeatherWrapper(key);
  }
});
</script>

<style lang="scss">
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  max-width: 320px;
  position: relative;
  overflow: hidden;
  min-height: 300px;
  max-height: 600px;
  overflow-y: auto;
}
.mainLayout {
  position: relative;
  background-color: #fff;
}
</style>
