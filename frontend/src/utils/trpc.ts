import { createTRPCReact } from "@trpc/react-query";
import type { WeatherRouter } from "../../../backend/";

export const trpc = createTRPCReact<WeatherRouter>();
