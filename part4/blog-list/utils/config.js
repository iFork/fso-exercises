require('dotenv').config();

let { MONGODB_URI } = process.env;
if (process.env.NODE_ENV !== 'production') {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
}
const { PORT } = process.env;

module.exports = { MONGODB_URI, PORT };
