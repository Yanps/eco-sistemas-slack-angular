const { Client } = require('pg');
const config = require('../config/database');

const client = new Client(config);

module.exports = client;