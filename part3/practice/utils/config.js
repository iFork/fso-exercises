// using dotenv to get env variables set in .env file
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const { MONGODB_URI } = process.env;
module.exports = { PORT, MONGODB_URI };
