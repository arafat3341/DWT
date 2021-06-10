const { request, response } = require("express");
const db = require("../config");
exports.all_classes = (request, response) => {
    db.conn.query(
        'select * from `class`',
        function (results) {
            response.send(results);
        }
    );
};