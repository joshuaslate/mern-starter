
const config = require('../config/main');

process.env.NODE_ENV = config.test_env;
process.env.MONGO_URL = `mongodb://localhost/${config.test_db}`;

exports.URI = '127.0.0.1';
