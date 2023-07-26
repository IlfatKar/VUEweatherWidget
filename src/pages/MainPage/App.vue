<template>
  <loading3-quarters-outlined v-if="loading" :spin="true" class="loadingIcon" />
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
import { ICitiesInfo } from "./types";
import { WeatherBlockTypes } from "@/widgetes/WeatherBlock/types";
import { parseWeatherResponce, swapArrayElements } from "./helpers/index";
import { notification } from "ant-design-vue";
import {
  IWeatherResponceError,
  IWeatherResponce,
} from "../../shared/api/types/index";
import { Loading3QuartersOutlined } from "@ant-design/icons-vue";

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
  saveCities();
};

const addCity = (city: string, completeLoad: () => void) => {
  fetchWeatherWrapper(city).then(() => {
    completeLoad();
  });
};

const swapCities = (idx1: number, idx2: number) => {
  swapArrayElements(citiesList.value, idx1, idx2);
  saveCities();
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
      loading.value = false;
      saveCities();
    })
    .catch((e: Error) => {
      notificationApi.error({
        message: "Weather fetching error",
        description: e.message,
      });
    });
};

const getUserLocation = () =>
  new Promise<void>((res, rej) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          fetchWeatherByLocation(lat, lng)
            .then((data) => {
              if (isError(data)) {
                throw new Error(data.message);
              }
              if (!cities.value.has(data.name)) {
                citiesList.value.push(data.name);
              }
              cities.value.set(data.name, parseWeatherResponce(data));
              loading.value = false;
              saveCities();
              res();
            })
            .catch((e: Error) => {
              notificationApi.error({
                message: "Weather fetching error",
                description: e.message,
              });
              rej("Weather fetching error");
            });
        },
        (error) => {
          citiesList.value.push("London");
          console.error("Error getting user location:", error);
          rej("Error getting user location:" + error);
        }
      );
    } else {
      citiesList.value.push("London");
      console.error("Geolocation is not supported by this browser.");
    }
  });

const saveCities = () => {
  localStorage.setItem("citiesList", JSON.stringify(citiesList.value));
};

onMounted(async () => {
  const sitiesTmp = JSON.parse(localStorage.getItem("citiesList") || "[]");

  if (sitiesTmp.length === 0) {
    await getUserLocation();
  } else {
    for (const item of sitiesTmp) {
      cities.value.set(item, null);
    }
    for (const key of cities.value.keys()) {
      fetchWeatherWrapper(key);
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
