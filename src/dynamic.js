// TALKS TO DATABASE TO GET DATA
const dbConnection = require('./database/db_connection.js');

// -- GET DATA

const getData = (query, cb) => {
  dbConnection.query(query, (err, res) => {
    if (err) {
      cb(err);
      console.log('error HAPPENED');
    } else {
      cb(null, res.rows);
    }
  });
};

// -- POST DATA

const postData = (topic_title, description, cb) => {
  dbConnection.query(
    'INSERT INTO topics (topic_title, description, user_id) VALUES ($1, $2, 1)',
    [topic_title, description],
    (err, res) => {
      if (err) {
        return cb(err);
      } else {
        cb(null, res);
      }
    }
  );
};

const postVote = (topic_id, user_id, value, cb) => {
  dbConnection.query(
    'INSERT INTO voting (topic_id, user_id, value) VALUES ($1, $2, $3)',
    [topic_id, user_id, value],
    (err, res) => {
      if (err) {
        return cb(err);
      } else {
        cb(null, res);
      }
    }
  );
};

const checkUserExists = (username, cb) => {
  return getData(
    `SELECT * FROM users WHERE username = '${username}';`,
    (err, res) => {
      if (res.length > 0) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    }
  );
};

module.exports = { getData, postData, postVote, checkUserExists };
