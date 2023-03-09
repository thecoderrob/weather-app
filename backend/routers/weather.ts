import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import axios from "axios";

// Get weather data from json file
import weather from "../weather.json";

const API_KEY = "02694c13c067d5c4dfc2cd10baa2eb8c"; // Should be inside .env file but was here for convenience

export const weatherRouter = router({
  cityWeather: publicProcedure
    .input(
      z.object({
        cityName: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { cityName } = input;
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

      try {
        const { data } = await axios.get(API_URL);
        return data;
      } catch (e) {
        throw new Error("Resource not found");
      }
    }),
  updateCityWeather: publicProcedure
    .input(
      z.object({
        lat: z.number(),
        lon: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { lat, lon } = input;

      console.log(lat, lon);

      const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

      try {
        const { data } = await axios.get(API_URL);
        return data;
      } catch (e) {
        throw new Error("Resource not found");
      }
    }),
  weather: publicProcedure.query(() => {
    return weather;
  }),
});
