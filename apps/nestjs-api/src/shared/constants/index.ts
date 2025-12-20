export enum Environments {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export const IS_DEV = process.env.NODE_ENV === Environments.DEVELOPMENT;
