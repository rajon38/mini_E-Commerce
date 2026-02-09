import dotenv from 'dotenv';
import AppError from '../errorHelpers/AppError';
import status from 'http-status';

dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string;
  BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  APP_URL: string;
}

const loadEnvVariables = (): EnvConfig => {

    const requiredEnvVars = [
        'PORT',
        'NODE_ENV',
        'DATABASE_URL',
        'BETTER_AUTH_SECRET',
        'BETTER_AUTH_URL',
        'ACCESS_TOKEN_SECRET',
        'REFRESH_TOKEN_SECRET',
        'ACCESS_TOKEN_EXPIRES_IN',
        'REFRESH_TOKEN_EXPIRES_IN',
        'BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN',
        'BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE',
        'EMAIL_USER',
        'EMAIL_PASS',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'APP_URL'
    ];
    requiredEnvVars.forEach((variable) => {
        if (!process.env[variable]) {
            throw new AppError(status.INTERNAL_SERVER_ERROR, `Environment variable ${variable} is required but not set in .env file.`);
        }
    })
    return {
        PORT: process.env.PORT as string || '8000',
        NODE_ENV: process.env.NODE_ENV as string || 'production',
        DATABASE_URL: process.env.DATABASE_URL as string ,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
        EMAIL_USER: process.env.EMAIL_USER as string,
        EMAIL_PASS: process.env.EMAIL_PASS as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        APP_URL: process.env.APP_URL as string,
    };
}

export const envVars = loadEnvVariables();