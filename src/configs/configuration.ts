import { DataSourceOptions } from 'typeorm';

export interface AppConfig {
  port: number;
  database: DataSourceOptions;
  redis: RedisConfig;
  environment: string;
}

export interface DatabaseConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10),
  },
  environment: process.env.NODE_ENV || 'development',
});
