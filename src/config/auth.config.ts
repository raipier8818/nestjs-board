import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  googleOauth: {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_OAUTH_CALLBACK_URL,
  },
}));
