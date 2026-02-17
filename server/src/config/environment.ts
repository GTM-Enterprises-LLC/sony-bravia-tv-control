import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  PORT: z.string().default('3001').transform(Number),
  TV_IP: z.string().ip({ message: 'TV_IP must be a valid IP address' }),
  PSK_KEY: z.string().min(4, { message: 'PSK_KEY must be at least 4 characters' }),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173')
});

// Parse and validate environment variables
export const env = envSchema.parse({
  PORT: process.env.PORT,
  TV_IP: process.env.TV_IP,
  PSK_KEY: process.env.PSK_KEY,
  NODE_ENV: process.env.NODE_ENV,
  CORS_ORIGIN: process.env.CORS_ORIGIN
});

// Runtime configuration (can be updated via API)
interface RuntimeConfig {
  tvIp: string;
  pskKey: string;
}

let runtimeConfig: RuntimeConfig = {
  tvIp: env.TV_IP,
  pskKey: env.PSK_KEY
};

export const getRuntimeConfig = (): RuntimeConfig => runtimeConfig;

export const updateRuntimeConfig = (config: Partial<RuntimeConfig>): void => {
  runtimeConfig = { ...runtimeConfig, ...config };
};
