const tape = require('tape');
const runDbBuild = require('../database/db_build');
const { getData, postData, checkUserExists } = require('../dynamic');

tape('tape is working', t => {
  t.equals(1, 1, 'one equals one');
  t.end();
});

// GET DATA TESTS

tape('getData returns array', t => {
  runDbBuild((err, res) => {
    let query = 'SELECT * FROM topics';
    getData(query, (err, res) => {
      if (err) t.fail(err);
      t.equals(Array.isArray(res), true, 'type of res should be array');
      t.end();
    });
  });
});

tape('getData returns array of objects', t => {
  runDbBuild((err, res) => {
    let query = 'SELECT * FROM topics';
    getData(query, (err, res) => {
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
    let query = 'SELECT * FROM topics';
    getData(query, (err, res) => {
      if (err) t.fail(err);
      let expected = [
        {
          id: 1,
          topic_title: 'Climbing',
          description: 'Shall we do this friday?',
          user_id: 1
        }
      ];
      t.deepEquals(res, expected, `should return ${expected}`);
      t.end();
    });
  });
});

// // checks userexists func
// tape('checks checkUserExists', t => {
//   runDbBuild((err, res) => {
//     let actual = checkUserExists('Helen', (err, res) => {
//       let actual = res;
//       let expected = true;
//       t.equals(actual, expected, `should return ${expected}`);
//       t.end();
//     });
//   });
// });

// tape('checks checkUserExists', t => {
//   runDbBuild((err, res) => {
//     let actual = checkUserExists('asdfasldkjfhasldkfjh', (err, res) => {
//       let actual = res;
//       let expected = false;
//       t.equals(actual, expected, `should return ${expected}`);
//       t.end();
//     });
//   });
// });

// // POST DATA TESTS
tape('testing postData', t => {
  runDbBuild((err, res) => {
    postData('hello', 'world', (err, res) => {
      if (err) t.fail(err);
      t.equal(res.command, 'INSERT', 'should call INSERT command');
      t.end();
    });
  });
});
