const fs = require('fs');
const dbConnection = require('./db_connection');
const sql = fs.readFileSync(`${__dirname}/db_build.sql`).toString();

dbConnection.query(sql, (err, res) => {
    if (err) throw err;
    console.log("all tables created with result: ", res);
});

const runDbBuild = cb => {
    dbConnection.query(sql, (err, res) => {
        if (err) return cb(err);
        cb(null, res);
    });
};

module.exports = runDbBuild;