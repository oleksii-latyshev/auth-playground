export enum Environments {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export const IS_DEV = process.env.NODE_ENV === Environments.DEVELOPMENT;

export const TIME_IN_MS = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
} as const;

export const TIME_IN_SECONDS = {
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
} as const;

export const SERVICE_NAME = 'nestjs-api';
