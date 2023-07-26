export interface IDescriptionItem {
  text: string;
  icon?: { type: "wind" | "pressure"; rotate?: number };
}

export interface IWeatherInfo {
  temp: number;
  wind: { speed: number; deg: number };
  description: string;
  icon: string;
  pressure: number;
  humidity: number;
  visibility: number;
  name: string;
  feelsLike: number;
}
