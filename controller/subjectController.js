const dbconfig = require("../config");

exports.all_subject = (req, res) => {
    dbconfig.query(
        'SELECT * FROM `subject`',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};