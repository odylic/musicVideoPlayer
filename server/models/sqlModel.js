const {Pool} = require('pg');
require('dotenv').config();

const URI = process.env.PGURI;

const pool = new Pool({connectionString: URI});

module.exports = {
  query: (text, params, callback) => {
    console.log('execute query', text);
    return pool.query(text, params, callback);
  },
};
