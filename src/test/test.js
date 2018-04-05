const tape = require("tape");
const runDbBuild = require("../src/database/db_build");
const { getData, postData } = require('../dynamic');

tape("tape is working", t => {
    t.equals(1, 1, "one equals one");
    t.end();
});

tape('what you are going to test', (t) => {
    runDbBuild((err, res) => {
        getData((err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log('ACUTAL: ', res.length);
                // return JSON.stringify(res);,
                //  your test goes here
                t.equals(1, 1, "one equals one");
                t.end();
            }
        });
    });
});