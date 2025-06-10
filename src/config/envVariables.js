const envVariables = {
  PORT: process.env.PORT || 3000,
  TokenConfig: {
    AUTH_SIGNATURE: process.env.TOKEN_SECRET || "your-secret-key",
    AUTH_EXPIRE_TIME: process.env.TOKEN_EXPIRES_IN || "1h",
  },
  DATABASE_URL: process.env.DATABASE_URL,
  HASH_SALT: process.env.HASH_SALT || 10,
  FIREBASE: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASURMENT_ID: process.env.FIREBASE_MEASURMENT_ID,
  },
};

export default envVariables;
