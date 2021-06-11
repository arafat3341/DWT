const dbconfig = require("../config");
const { request, response } = require("express");

exports.all_subject = (request, response) => {
    dbconfig.conn.query(
        'SELECT * FROM `subject`',
        function (err, results, fields) {
            response.send(results); // results contains rows returned by server
        }
    );
};