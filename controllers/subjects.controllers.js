const { request, response } = require("express");
const db = require("../config");
exports.all_subjects = (request, response) => {
    db.conn.query(
        'select * from `subject`',
        function (results) {
            response.send(results);
        }
    );
};