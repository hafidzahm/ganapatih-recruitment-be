// Load environment variables for tests from .env.test
// This runs before the test framework is installed/initialized.
const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });
