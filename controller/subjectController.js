const dbconfig = require("../config");

exports.all_subject = (req, res) => {
    dbconfig.query(
        'SELECT * FROM `subject`',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};

exports.single_subject = (req,res)=>{
    const subjectId = req.params.subjectId;
    const userId = req.params.userId;//req.body.user_id;
    dbconfig.query(
        'SELECT t.test_name,m.marks from subject s INNER JOIN class c on c.class_id = s.class_id INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN assigned_pupil ap on ap.subject_id = s.subject_id INNER JOIN mark m on m.test_id = t.test_id where m.user_id = ? and s.subject_id = ?', [userId, subjectId],
        function (err, results, fields) {
            if (err) throw err;
            res.send(results);
        }
    );
}
//SELECT * from subject s INNER JOIN class c on c.class_id = s.class_id INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN assigned_pupil ap on ap.class_id = s.class_id where ap.user_id = 32

exports.user_subjects = (req,res)=>{
    const userId = req.params.Id;
    dbconfig.query(
        'SELECT * from subject s INNER JOIN class c on c.class_id = s.class_id INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN assigned_pupil ap on ap.class_id = s.class_id where ap.user_id = ?', userId,
        function (err, results, fields) {
            if (err) throw err;
            res.send(results);
        }
    );
}
exports.user_subjects_test_mean = (req,res)=>{
    const userId = req.params.Id;
    dbconfig.query(
        'SELECT AVG(m.marks) from mark m where user_id = ?', userId,
        function (err, results, fields) {
            if (err) throw err;
            res.send(results);
        }
    );
}