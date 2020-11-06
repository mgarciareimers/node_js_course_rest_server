// ===================
// Port
// ===================
process.env.PORT = process.env.PORT || 3000;

// ===================
// Environment
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===================
// JWT expiration
// ===================
// Never = 9999y
process.env.JWT_EXPIRATION = '9999y'

// ===================
// Authentication seed
// ===================
process.env.AUTHENTICATION_SEED = 'dev-node-js-course-fernando-herrera-seed' || process.env.AUTHENTICATION_SEED;

// ===================
// Database url
// ===================
process.env.DATABASE_URL = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/coffee' : process.env.DATABASE_URL;