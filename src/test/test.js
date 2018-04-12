const tape = require('tape');
const runDbBuild = require('../database/db_build');
const { getData, postTopic, checkUserExists } = require('../queries');

tape('tape is working', t => {
  t.equals(1, 1, 'one equals one');
  t.end();
});

// GET DATA TESTS

tape('getData returns array', t => {
  runDbBuild((err, res) => {
    getData((err, res) => {
      if (err) t.fail(err);
      t.equals(Array.isArray(res), true, 'type of res should be array');
      t.end();
    });
  });
});

tape('getData returns array of objects', t => {
  runDbBuild((err, res) => {
    getData((err, res) => {
      t.equals(
        typeof res[0],
        'object',
        'type of res should be array of objects'
      );
      t.end();
    });
  });
});

tape('deepEquals of getData', t => {
  runDbBuild((err, res) => {
    getData((err, res) => {
      if (err) t.fail(err);
      let expected = [
        {
          id: 1,
          title: 'Climbing',
          description: 'Shall we do this friday?',
          author: 'Helen',
          yes_votes: '1',
          no_votes: '0',
          num_comments: '1'
        }
      ];
      t.deepEquals(res, expected, `should return ${expected}`);
      t.end();
    });
  });
});

// // POST DATA TESTS
tape('testing postData', t => {
  runDbBuild((err, res) => {
    postTopic('hello', 'world', 1, (err, res) => {
      if (err) t.fail(err);
      t.equal(res.command, 'INSERT', 'should call INSERT command');
      t.end();
    });
  });
});
