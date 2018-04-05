const tape = require("tape");
const runDbBuild = require("../database/db_build");
const { getData, postData } = require('../dynamic');

tape("tape is working", t => {
    t.equals(1, 1, "one equals one");
    t.end();
});

tape('testing getData', (t) => {
    runDbBuild((err, res) => {
        getData((err, res) => {
            if (err) {
                t.fail(err);
                t.end();
            } else {
                console.log('ACUTAL: ', res);
                // return JSON.stringify(res);,
                //  your test goes here
                t.equals(1, 1, "one equals one");
                t.end();
            }
        });
    });
});
// POST DATA TESTS
tape('testing postData', (t) => {
    runDbBuild((err, res) => {
        postData("hello", "world", (err, res) => {
            if (err) t.fail(err);
            console.log('post ACUTAL: ', res.command);
            t.equal(res.command,"INSERT", "should call INSERT command");
            t.end();
        });
    });
});
