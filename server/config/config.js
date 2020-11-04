// ===================
// Port
// ===================
process.env.PORT = process.env.PORT || 3000;

// ===================
// Environment
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===================
// Database url
// ===================
process.env.DATABASE_URL = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/coffee' : process.env.DATABASE_URL;