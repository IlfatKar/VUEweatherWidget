import { IWeatherResponce } from "../../../shared/api/types/index";
export const parseWeatherResponce = (data: IWeatherResponce) => {
  return {
    description: data.weather[0].description,
    temp: data.main.temp,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility,
    wind: { deg: data.wind.deg, speed: data.wind.speed },
    icon: data.weather[0].icon,
    name: data.name,
    feelsLike: data.main.feels_like,
  };
};

export const swapArrayElements = (
  arr: Array<unknown>,
  index1: number,
  index2: number
) => {
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
};

export const getUserLocation = () =>
  new Promise<[number, number]>((res, rej) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          res([lat, lng]);
        },
        (error) => {
          console.error("Error getting user location:", error);
          rej("Error getting user location:" + error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  });

export const saveCities = (cities: string[]) => {
  localStorage.setItem("citiesList", JSON.stringify(cities));
};

export const getCities = (): string[] => {
  return JSON.parse(localStorage.getItem("citiesList") || "[]");
};
