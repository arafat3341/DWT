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
    const subjectId = req.params.Id;
    const userId = 32;//req.body.user_id;
    dbconfig.query(
        'SELECT * from subject s INNER JOIN class c on c.class_id = s.class_id INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN assigned_pupil ap on ap.class_id = s.class_id where ap.user_id = ? and s.subject_id = ?', [userId, subjectId],
        function (err, results, fields) {
            if (err) throw err;
            res.send(results);
        }
    );
}
//SELECT * from subject s INNER JOIN class c on c.class_id = s.class_id INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN assigned_pupil ap on ap.class_id = s.class_id where ap.user_id = 32