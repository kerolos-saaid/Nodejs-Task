export default {
  PORT: process.env.PORT || 3000,
  TokenConfig: {
    AUTH_SIGNATURE: process.env.TOKEN_SECRET || "your-secret-key",
    AUTH_EXPIRE_TIME: process.env.TOKEN_EXPIRES_IN || "1h",
  },
  DATABASE_URL: process.env.DATABASE_URL,
};
