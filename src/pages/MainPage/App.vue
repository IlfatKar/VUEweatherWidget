<template>
  <loading3-quarters-outlined v-if="loading" :spin="true" class="loadingIcon" />
  <a-typography-title :level="3" v-else-if="citiesList.length === 0">
    Weather fetching error. <br />
    Try again later.
  </a-typography-title>
  <a-layout class="mainLayout" v-else>
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
import {
  fetchWeather,
  fetchWeatherByLocation,
} from "../../shared/api/fetchWeather";

import WeatherBlock from "../../widgetes/WeatherBlock/WeatherBlock.vue";
import WeatherSettings from "../../widgetes/WeatherSettings/WeatherSettings.vue";
import { WeatherBlockTypes } from "@/widgetes/WeatherBlock/types";

import { ICitiesInfo, WeatherWrapperArgs } from "./types";
import {
  parseWeatherResponce,
  swapArrayElements,
  getUserLocation,
  getCities,
  saveCities,
} from "./helpers";

import { notification } from "ant-design-vue";
import { Loading3QuartersOutlined } from "@ant-design/icons-vue";
import { isResponceError } from "../../shared/api/helpers";

const [notificationApi, contextHolder] = notification.useNotification();

const cities = ref<ICitiesInfo>(new Map());
const citiesList = ref<string[]>(Array.from(cities.value.keys()));
const isSettingsOpen = ref<boolean>(false);
const loading = ref<boolean>(true);

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
  saveCities(citiesList.value);
};

const addCity = (city: string, completeLoad: () => void) => {
  fetchWeatherWrapper({ city }).then(() => {
    completeLoad();
  });
};

const swapCities = (idx1: number, idx2: number) => {
  swapArrayElements(citiesList.value, idx1, idx2);
  saveCities(citiesList.value);
};

const fetchWeatherWrapper = async (res: WeatherWrapperArgs) => {
  return (
    "city" in res
      ? fetchWeather(res.city)
      : fetchWeatherByLocation(res.location[0], res.location[1])
  )
    .then((data) => {
      if (isResponceError(data)) {
        throw new Error(data.message);
      }
      const parsedData = parseWeatherResponce(data);
      cities.value.set(parsedData.name, parsedData);
      citiesList.value.push(parsedData.name);
      loading.value = false;
      saveCities(citiesList.value);
    })
    .catch((e: Error) => {
      notificationApi.error({
        message: "Weather fetching error",
        description: e.message,
      });
    });
};

onMounted(async () => {
  const sitiesTmp = getCities();

  if (sitiesTmp.length === 0) {
    try {
      const [lat, lng] = await getUserLocation();
      fetchWeatherWrapper({ location: [lat, lng] });
    } catch (e) {
      citiesList.value.push("London");
    }
  } else {
    for (const item of sitiesTmp) {
      cities.value.set(item, null);
    }
    for (const key of cities.value.keys()) {
      fetchWeatherWrapper({ city: key });
    }
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
  min-height: 600px;
  max-height: 600px;
  overflow-y: auto;
}
.mainLayout {
  position: relative;
  background-color: #fff;
}
.loadingIcon {
  transform: scale(3);
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>
