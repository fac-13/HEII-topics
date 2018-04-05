const tape = require("tape");
const runDbBuild = require("../database/db_build");
const { getData, postData } = require("../dynamic");

tape("tape is working", t => {
  t.equals(1, 1, "one equals one");
  t.end();
});

// GET DATA TESTS

tape("getData returns array", t => {
  runDbBuild((err, res) => {
    let query = "SELECT * FROM topic";
    getData(query, (err, res) => {
      if (err) t.fail(err);
      console.log("ACTUAL: ", res);
      // return JSON.stringify(res);,
      //  your test goes here
      t.equals(Array.isArray(res), true, "type of res should be array");
      t.end();
    });
  });
});

tape("getData returns array of objects", t => {
  runDbBuild((err, res) => {
    let query = "SELECT * FROM topic";
    getData(query, (err, res) => {
      if (err) t.fail(err);
      console.log("ACTUAL: ", res);
      // return JSON.stringify(res);,
      //  your test goes here
      t.equals(
        typeof res[0],
        "object",
        "type of res should be array of objects"
      );
      t.end();
    });
  });
});

tape("deepEquals of getData", t => {
  runDbBuild((err, res) => {
    let query = "SELECT * FROM topic";
    getData(query, (err, res) => {
      if (err) t.fail(err);
      console.log("ACTUAL: ", res);
      let expected = [
        {
          id: 1,
          topic_title: "Climbing",
          description: "Shall we do this friday?",
          user_id: 1
        }
      ];
      t.deepEquals(res, expected, `should return ${expected}`);
      t.end();
    });
  });
});

// POST DATA TESTS
tape("testing postData", t => {
  runDbBuild((err, res) => {
    postData("hello", "world", (err, res) => {
      if (err) t.fail(err);
      console.log("post ACUTAL: ", res.command);
      t.equal(res.command, "INSERT", "should call INSERT command");
      t.end();
    });
  });
});
