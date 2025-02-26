import { ConfigModule } from '@nestjs/config';
import z from 'zod';

ConfigModule.forRoot();

const ENV_SCHEMA = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  MONGO_URL: z.string().url().min(1),
  AUTH_SECRET: z.string().min(64),
  // https://github.com/vercel/ms
  TOKEN_AGE: z.string().min(1).default('30m'),
  NODE_ENV: z
    .preprocess(
      (x) => typeof x == 'string' && x.toLowerCase(),
      z.enum(['development', 'production', 'test']),
    )
    .default('production'),
});

const parsed = ENV_SCHEMA.safeParse(process.env);

if (parsed.success === false) {
  console.error(
    '❌[build] Invalid environment variables:',
    parsed.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
