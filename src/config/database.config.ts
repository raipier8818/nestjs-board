import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mongoose: {
    uri: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    password: process.env.REDIS_PASSWORD,
  },
}));
