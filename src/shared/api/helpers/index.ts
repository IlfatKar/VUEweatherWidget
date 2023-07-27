import { IWeatherResponce, IWeatherResponceError } from "../types";

export const isResponceError = (
  data: IWeatherResponceError | IWeatherResponce
): data is IWeatherResponceError => {
  return (data as IWeatherResponceError).message !== undefined;
};
