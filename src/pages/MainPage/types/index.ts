import { IWeatherInfo } from "@/shared/types";

export type ICitiesInfo = Map<string, IWeatherInfo | null>;

interface IWeatherWrapperCityArgs {
  city: string;
}

interface IWeatherWrapperLocationArgs {
  location: [number, number];
}
export type WeatherWrapperArgs =
  | IWeatherWrapperCityArgs
  | IWeatherWrapperLocationArgs;
