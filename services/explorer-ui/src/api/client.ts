import axios, { AxiosError } from "axios";
import { type z } from "zod";
import { API_URL } from "~/service/constants";

const client = axios.create({
  baseURL: API_URL,
});

client.defaults.headers.get["Content-Type"] = "application/json";
client.defaults.headers.get["Access-Control-Allow-Credentials"] = "true";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      throw new ApiError(
        error.response.status,
        //error.response.data?.message || "An error occurred",
        "An error occurred",
      );
    } else if (error.request) {
      throw new ApiError(0, "No response received from server");
    } else {
      throw new ApiError(0, error.message || "An unexpected error occurred");
    }
  },
);

export const validateResponse = <T extends z.ZodType>(
  schema: T,
  data: unknown,
): z.infer<T> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return schema.parse(data);
};

export default client;
