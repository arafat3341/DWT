const dbconfig = require("../config");
const fetch = require("node-fetch");
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
        'SELECT t.test_name,m.marks from subject s INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN mark m on m.test_id = t.test_id where m.user_id=? and s.subject_id = ?', [userId, subjectId],
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

// 12 page 10 start
exports.list_assign_subject = async (req, res) => {
    const userId = req.params.Id; // teacher id
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    
    if (result[0].user_type == 'teacher') {
        const sqlQry = 'select * from assign_teacher atc INNER JOIN subject s on s.subject_id = atc.subject_id where atc.user_id = ?';
        dbconfig.query(sqlQry, userId, (err, results) => {
            if (err) throw err;
            res.send(results); // results contains rows returned by server
        });
    } else {
        //code for deny permission
    }

}

exports.deleteSubject = async (req, res) => {
    // const userId = req.params.Id;
    const subjectId = req.params.subject_id;
    // let response = await fetch('http://localhost:5000/users/' + userId);
    // let result = await response.json();
    // console.log(userId)
    console.log(subjectId)

    // if (result[0].user_type == 'admin') {
        dbconfig.query(
            'SELECT count(*) AS testCount FROM test WHERE subject_id = ?', subjectId,
            function (err, results, fields) {
                if (err) throw err;
                console.log(results[0].testCount)
                if (Number(results[0].testCount) > 0) {
                    console.log("This subject has records");
                } else {
                    const qry = 'DELETE FROM subject where subject_id = ?';
                    dbconfig.query(qry, [subjectId], (err, result) => {
                        if (err) throw err;
                        console.log("1 record deleted");
                    });
                }
            }
        );
    // }
}

// optional if needed
exports.assign_teacher = async (req,res) => {
    const user_id = req.body.id;
    const subjectId = req.params.subject_id;
    const created_at = new Date();

    const sql = 'INSERT INTO assign_teacher set ?';
    dbconfig.query(sql, [user_id,subjectId,created_at], (err, results) => {
        if (err) throw err;
        res.status(200).send('Inserted successfully'); // results contains rows returned by server
    });
}