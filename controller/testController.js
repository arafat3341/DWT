const dbconfig = require("../config");

exports.all_test = (req, res) => {
    dbconfig.query(
        'SELECT * FROM `test`',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};