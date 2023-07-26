import { IWeatherResponce } from "./types";
export const fetchWeather = async (city: string): Promise<IWeatherResponce> => {
  return await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.VUE_APP_API_KEY}`
  ).then((data) => data.json());
};
