import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET,
    signOptions: parseInt(process.env.JWT_ACCESS_EXPIRES_IN || '1h'),
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET, // Replace with your own secret key
    signOptions: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '1d'), // Token expiration time
  },
};
