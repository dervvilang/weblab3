export interface BookResult {
  key: string;
  title: string;
  authors: string;
  year: string;
  coverUrl: string | null;
  detailsUrl: string;
}

export interface CurrencyEntry {
  code: string;
  name: string;
}

export interface WeatherResult {
  city: string;
  country?: string;
  temperature: number;
  windSpeed: number;
  time: string;
}
