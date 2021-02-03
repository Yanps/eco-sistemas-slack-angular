const {Pool, Client} = require('pg');
const config = require('../config/database');

const client = new Client(config);

const query = ``;

client.connect();

client.query(query, (err, res) => {
    console.log(err, res);
    client.end();
});

