import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  jwtSecret: process.env.JWT_SECRET || 'career360_super_secret_jwt_key_2026',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
