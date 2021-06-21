const dbconfig = require("../config");

exports.all_test = (req, res) => {
    dbconfig.query(
        'SELECT * FROM `test`',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};

exports.get_all_subject_grades = (req, res) => {
    const userId = req.params.Id;
    dbconfig.query(
        'SELECT ap.subject_id, (SELECT AVG(m.marks) from mark m INNER JOIN test t on t.test_id = m.test_id where t.subject_id = ap.subject_id and m.user_id = ?) as AverageGrade FROM assigned_pupil ap where ap.user_id=?', [userId,userId],
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};