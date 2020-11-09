// ===================
// Port
// ===================
process.env.PORT = process.env.PORT || 3000;

// ===================
// Environment
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===================
// JWT Expiration
// ===================
// Never = 9999y
process.env.JWT_EXPIRATION = '9999y'

// ===================
// Authentication Seed
// ===================
process.env.AUTHENTICATION_SEED = 'dev-node-js-course-fernando-herrera-seed' || process.env.AUTHENTICATION_SEED;

// ===================
// Database Url
// ===================
process.env.DATABASE_URL = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/coffee' : process.env.DATABASE_URL;

// ===================
// Google Client Id
// ===================
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '132769593997-ocbcpp1apdvh69kcjstijj8ncji2uamn.apps.googleusercontent.com';