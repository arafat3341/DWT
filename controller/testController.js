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
        'SELECT s.subject_id, (SELECT AVG(m.marks) from mark m INNER JOIN test t on t.test_id = m.test_id where t.subject_id = s.subject_id and m.user_id = ?) as AverageGrade FROM subject s inner join class c on c.class_id = s.class_id inner join assigned_pupil ap on ap.class_id=c.class_id where ap.user_id=?', [userId,userId],
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};