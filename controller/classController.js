const dbconfig = require("../config");

exports.all_class = (req, res) => {
    dbconfig.query(
        'SELECT * FROM `class`',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};