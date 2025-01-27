import axios, { type AxiosError } from "axios";
import { type z } from "zod";
import { API_URL } from "~/service/constants";

// TODO: evaluate if client instead should be a hook?
const client = axios.create({
  baseURL: API_URL,
});

client.defaults.headers.get["Content-Type"] = "application/json";
client.defaults.headers.get["Access-Control-Allow-Credentials"] = "true";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public type: "API" | "Schema" = "API"
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let lastSuccessfulRequest: { date: Date; path: string } | null = null;
let lastError: { date: Date; error: ApiError } | null = null;

client.interceptors.response.use(
  (response) => {
    lastSuccessfulRequest = {
      date: new Date(),
      path: response.config.url ?? "Unknown",
    };
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      lastError = {
        date: new Date(),
        error: new ApiError(error.response.status, "An error occurred", "API"),
      };
    } else if (error.request) {
      lastError = {
        date: new Date(),
        error: new ApiError(0, "No response received from server", "API"),
      };
    } else {
      lastError = {
        date: new Date(),
        error: new ApiError(
          0,
          error.message || "An unexpected error occurred",
          "API"
        ),
      };
    }
    throw lastError.error;
  }
);

export const validateResponse = <T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return schema.parse(data);
  } catch (error) {
    lastError = {
      date: new Date(),
      error: new ApiError(400, "Schema validation error", "Schema"),
    };
    throw lastError.error;
  }
};

export const getLastSuccessfulRequest = () => lastSuccessfulRequest;
export const getLastError = () => lastError;

export default client;
