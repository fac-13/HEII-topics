// TALKS TO DATABASE TO GET DATA
const dbConnection = require('./database/db_connection.js');

// -- GET DATA

const getData = cb => {
  dbConnection.query(
    `SELECT
      t.id,
      t.topic_title AS title,
      t.description,
      u.username AS author,
      COUNT(CASE WHEN v.value = 'yes' THEN 1 ELSE null END) AS yes_votes,
      COUNT(CASE WHEN v.value = 'no' THEN 1 ELSE null END) AS no_votes,
      COUNT(c.*) AS num_comments
    FROM topics t
    LEFT JOIN users u
    ON t.user_id = u.id
    LEFT JOIN voting v
    ON t.id = v.topic_id
    LEFT JOIN comments c
    ON t.id = c.topic_id
    GROUP BY t.id, u.username
    ORDER BY t.id`,
    (err, res) => {
      if (err) {
        cb(err);
        console.log(err);
      } else {
        cb(null, res.rows);
      }
    }
  );
};

const getUsername = (id, cb) => {
  dbConnection.query(
    'SELECT username FROM users WHERE id = $1',
    [id],
    (err, res) => {
      if (err) {
        cb(err);
        console.log(err);
      } else {
        cb(null, res.rows);
      }
    }
  );
};

const getUserData = (username, cb) => {
  dbConnection.query(
    'SELECT * FROM users WHERE username = $1',
    [username],
    (err, res) => {
      if (err) {
        cb(err);
        console.log(err);
      } else {
        cb(null, res.rows);
      }
    }
  );
};

const getComments = (topic_id, cb) => {
  dbConnection.query(
    'SELECT * FROM comments WHERE topic_id = $1',
    [topic_id],
    (err, res) => {
      if (err) {
        cb(err);
        console.log('error HAPPENED');
      } else {
        cb(null, res.rows);
      }
    }
  );
};
// -- POST DATA

const postTopic = (topic_title, description, user_id, cb) => {
  dbConnection.query(
    'INSERT INTO topics (topic_title, description, user_id) VALUES ($1, $2, $3)',
    [topic_title, description, user_id],
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

const postUser = (username, password, cb) => {
  dbConnection.query(
    'INSERT INTO users (username, password) VALUES ($1, $2)',
    [username, password],
    (err, res) => {
      if (err) {
        return cb(err);
      } else {
        cb(null, res);
      }
    }
  );
};

module.exports = {
  getData,
  getUserData,
  getComments,
  postTopic,
  postVote,
  postUser
};
