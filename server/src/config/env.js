require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

module.exports = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: required('MONGODB_URI'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES) || 50 * 1024 * 1024,
  seedDemoEmail: process.env.SEED_DEMO_EMAIL || 'demo@feedants.com',
  seedDemoPassword: process.env.SEED_DEMO_PASSWORD || 'Demo@1234',
};
