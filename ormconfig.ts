import { DataSource, DataSourceOptions } from 'typeorm';

export let dataSourceOption: DataSourceOptions;

const commonOptions = {
  synchronize: false, // always false for data lose
  migrations: ['./migrations/*.js'],
};

switch (process.env.NODE_ENV) {
  case 'development':
    dataSourceOption = {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
      ...commonOptions,
    };
    break;
  case 'test':
    dataSourceOption = {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
      ...commonOptions,
    };
    break;
  case 'production':
    dataSourceOption = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
      ssl: {
        rejectUnauthorized: false,
      },
      ...commonOptions,
    };
    break;
  default:
    throw new Error('unknown Environment');
}

const dbConfig = new DataSource(dataSourceOption);

dbConfig
  ?.initialize()
  .then(() => {
    console.log(`Data Source has been initialized`);
    console.log(dataSourceOption);
  })
  .catch((err) => {
    console.error(`Data Source initialization error`, err);
  });
export default dbConfig;
