const path = require('path')
const ENV_PATH = path.join(__dirname, '../../.env');
require('dotenv').config({path: ENV_PATH});
console.log(process.env.TOKEN)