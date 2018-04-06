// TALKS TO DATABASE TO GET DATA
const dbConnection = require('./database/db_connection.js');

// -- GET DATA

const getData = (query, cb) => {
  console.log('got to getdata');
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

const postData = (topicTitle, description, cb) => {
  dbConnection.query(
    'INSERT INTO topic (topic_title, description, user_id) VALUES ($1, $2, 1)',
    [topicTitle, description],
    (err, res) => {
      if (err) {
        return cb(err);
      } else {
        cb(null, res);
      }
    }
  );
};

const postVote = (topic_id, user_id, vote_value, cb) => {
  dbConnection.query(
    'INSERT INTO voting (topic_id, user_id, vote_value) VALUES ($1, $2, $3)',
    [topic_id, user_id, vote_value],
    (err, res) => {
      if (err) {
        return cb(err);
      } else {
        cb(null, res);
      }
    }
  );
};

module.exports = { getData, postData, postVote };
