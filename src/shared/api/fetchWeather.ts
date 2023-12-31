import { IWeatherResponce, IWeatherResponceError } from "./types";
export const fetchWeather = async (
  city: string
): Promise<IWeatherResponce | IWeatherResponceError> => {
  return await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.VUE_APP_API_KEY}`
  ).then((data) => {
    return data.json();
  });
};
export const fetchWeatherByLocation = async (
  lat: number,
  lon: number
): Promise<IWeatherResponce | IWeatherResponceError> => {
  return await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.VUE_APP_API_KEY}`
  ).then((data) => {
    return data.json();
  });
};
