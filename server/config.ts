import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const config = {
  database: {
    url: process.env.DATABASE_URL,
  },
};

export default config;
