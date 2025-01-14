const POSTGRES_IP = process.env.POSTGRES_IP ?? "localhost";
const POSTGRES_PORT = Number(process.env.POSTGRES_PORT) || 5432;
const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME ?? "aztec_listener";
const POSTGRES_ADMIN = process.env.POSTGRES_ADMIN ?? "admin";
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? "secret-local-password";

export const dbCredentials = {
  host: POSTGRES_IP,
  port: POSTGRES_PORT,
  user: POSTGRES_ADMIN,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB_NAME,
};

export const getEnvironmentString = () => {
  return JSON.stringify({
    POSTGRES_IP,
    POSTGRES_PORT,
    POSTGRES_DB_NAME,
    POSTGRES_ADMIN,
    POSTGRES_PASSWORD: "REDACTED",
  });
}
