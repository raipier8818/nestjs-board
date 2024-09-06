import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  session: {
    secret: process.env.SESSION_SECRET,
    maxAge: parseInt(process.env.SESSION_MAX_AGE, 10) || 3600,
  }
}));