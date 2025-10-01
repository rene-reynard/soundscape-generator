import { fetchWeatherApi } from 'openmeteo';
import {coords} from "./tomtom";

export default async function getWeather() {
    let params = {
        "latitude": coords.latitude,
        "longitude": coords.longitude,
        "current": ["is_day", "apparent_temperature", "relative_humidity_2m", "temperature_2m", "precipitation", "rain", "showers", "snowfall", "surface_pressure", "pressure_msl", "cloud_cover", "weather_code", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];

    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
        `\nCoordinates: ${latitude}°N ${longitude}°E`,
        `\nElevation: ${elevation}m asl`,
        `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
    );

    const current = response.current()!;

    return {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            is_day: current.variables(0)!.value(),
            apparent_temperature: current.variables(1)!.value(),
            relative_humidity_2m: current.variables(2)!.value(),
            temperature_2m: current.variables(3)!.value(),
            precipitation: current.variables(4)!.value(),
            rain: current.variables(5)!.value(),
            showers: current.variables(6)!.value(),
            snowfall: current.variables(7)!.value(),
            surface_pressure: current.variables(8)!.value(),
            pressure_msl: current.variables(9)!.value(),
            cloud_cover: current.variables(10)!.value(),
            weather_code: current.variables(11)!.value(),
            wind_speed_10m: current.variables(12)!.value(),
            wind_direction_10m: current.variables(13)!.value(),
            wind_gusts_10m: current.variables(14)!.value(),
        },
    };
}