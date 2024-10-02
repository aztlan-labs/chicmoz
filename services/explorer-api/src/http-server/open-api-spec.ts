import { openApiPaths } from "./routes/index.js";

export const genereateOpenApiSpec = () => ({
  "openapi": "3.0.0",
  "info": {
    "title": "Aztec Scan API",
    "version": "0.1.0",
    "description": "API for exploring Aztec Network",
  },
  "servers": [
    {
      "url": "https://api.chicmoz.info/v1/{projectId}",
      "variables": {
        "projectId": {
          "default": "d1e2083a-660c-4314-a6f2-1d42f4b944f4",
          "description": "The project ID"
        }
      }
    },
    {
      "url": "http://explorer-api.localhost/v1/{projectId}",
      "variables": {
        "projectId": {
          "default": "d1e2083a-660c-4314-a6f2-1d42f4b944f4",
          "description": "The project ID"
        }
      }
    }
  ],
  paths: openApiPaths,
});
