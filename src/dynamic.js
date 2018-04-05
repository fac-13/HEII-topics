// TALKS TO DATABASE TO GET DATA
const dbConnection = require('./database/db_connection.js');

// -- GET DATA

const getData = cb => {
  dbConnection.query('SELECT * FROM topic', (err, res) => {
    if (err) {
      cb(err);
    } else {
      cb(null, res.rows);
    }
  });
};

// -- POST DATA

const postData = (name, location, cb) => {
  dbConnection.query(
    'INSERT INTO users (name, location) VALUES ($1, $2)',
    [name, location],
    (err, res) => {
      if (err) {
        return cb(err);
      } else {
        cb(null, res);
      }
    }
  );
};

module.exports = { getData, postData };