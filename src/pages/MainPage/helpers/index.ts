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
