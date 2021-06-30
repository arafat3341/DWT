const dbconfig = require("../config");
const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const fastcsv = require("fast-csv")

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

exports.all_users = (req, res) => {
    var decoded = jwt.verify(req.token, 'shhhhh');
    console.log(decoded.foo)
    if('bar' === decoded.foo){
        dbconfig.query(
            'SELECT * FROM `users`',
            function (err, results, fields) {
                if (err) res.err;
                res.send(results); // results contains rows returned by server
            }
        );
    }
    else{
        res.status(401).send('401 Unauthorized')
    }
};
let getUserId;
exports.getLogin = (req, res,) => {
    //res.json("user id:" + getUserId ) 
    //if (err) res.status(401).send('401 Unauthorized');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(getUserId));
    
    //getUserId = 0;
    res.end();
}
exports.login = (req,res) => {
    const sql = "select * from users where user_name = ?";
    const user_name = req.body.user_name;
    const pass = req.body.password;
    console.log(user_name)
    console.log(pass)
    dbconfig.query(sql, user_name, async (err, result) => {
        if (err) throw err;
        if (result.length != 0) {
            getUserId = result[0].user_id;
            const match = await bcrypt.compare(pass, result[0].password);
            if (match) {
                //res.json(result)
                switch (result[0].user_type) {
                case 'admin':
                    console.log('logged in as a admin');
                    res.redirect('http://localhost/api/admin.php')
                    break;
                case 'teacher':
                    console.log('logged in as a teacher');
                    res.redirect('http://localhost/api/teacher.php')
                    break;
                case 'student':
                    console.log('logged in as a student');
                    res.redirect('http://localhost/api/student.php')
                    break;
                default:
                    res.json('auth failed')
                    break;
                }
        }
        //console.log(result[0].password)
        
        }
        else res.status(401).send('401 Unauthorized');
    });
}

exports.addUser = async (req, res) => {
    const sql = "INSERT INTO users set ?";
    const hash2 = await bcrypt.hash(req.body.password, 10);
    const data = {
        user_name: req.body.user_name,
        password: hash2,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_type: req.body.user_type,
        created_at: new Date()
    }
    dbconfig.query(sql, data, (err, result) => {
        if (err) throw err;
        console.log("1 record inserted");
    });
    console.log(data)
    //res.json(data)
    res.redirect("/users");
}
exports.edit_user = (req, res) => {
    const userId = req.params.Id;
    dbconfig.query(
        'SELECT * FROM `users` where user_id = ?', userId,
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
}
exports.update_user = async (req, res) => {
    const userId = req.params.Id;
    const user_name = req.body.user_name;
    const password = await bcrypt.hash(req.body.password, 10);
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const user_type = req.body.user_type;
    let response = await fetch('http://localhost:5000/users');
    let result = await response.json();
    let userType;
    result.forEach(obj => {
        userType = obj.user_type
    })
    switch (userType) {
        case 'student':
            const sql = 'update users set user_name = ?, password = ?, first_name = ?, last_name = ?  where user_id = ?'
            dbconfig.query(sql, [user_name, password, first_name, last_name, userId], (err, result) => {
                if (err) throw err;
                console.log("1 record updated");
            });
            res.redirect("/api/v1.1/all_users");
            break;
        case 'teacher':
            const sql2 = 'update users set user_name = ?, password = ?, first_name = ?, last_name = ?  where user_id = ?'
            dbconfig.query(sql2, [user_name, password, first_name, last_name, userId], (err, result) => {
                if (err) throw err;
                console.log("1 record updated");
            });
            res.redirect("/api/v1.1/all_users");
            break;
        case 'admin':
            const sql3 = 'update users set user_name = ?, password = ?, first_name = ?, last_name = ?, user_type = ?  where user_id = ?'
            dbconfig.query(sql3, [user_name, password, first_name, last_name, user_type, userId], (err, result) => {
                if (err) throw err;
                console.log("1 record updated");
            });
            res.redirect("/api/v1.1/all_users");
            break;
        default:
            break;
    }

}
exports.delete_user = (req, res) => {
    const userId = req.params.Id;
    let userType;
    let isEmpty = false;
    dbconfig.query(
        'SELECT user_type FROM `users` where user_id = ?', userId,
        function (err, results, fields) {
            results.forEach(obj => {
                userType = obj.user_type
            })
            if (userType == "teacher") {
                dbconfig.query(
                    'SELECT u.user_id FROM users u INNER join assign_teacher a on u.user_id = a.user_id INNER JOIN subject s on s.subject_id = a.subject_id where a.user_id = ? and s.is_archived = 0', userId,
                    function (err, results, fields) {
                        //res.send(results); // results contains rows returned by server
                        // results.forEach(obj => {
                        //     userType = obj.user_type
                        // })
                        if (results[0] == null) {
                            dbconfig.query(
                                'delete FROM `users` where user_id = ?', userId,
                                function (err, results, fields) {
                                    if (err) throw err;
                                    console.log("1 record is deleted");
                                }
                            );
                            res.redirect("/users");
                        }
                        else {
                            res.sendStatus(401)
                        }
                    }
                );
            }
            else if (userType == "student") {
                const sql2 = 'DELETE FROM mark WHERE user_id = ?' 
                const sql3 = 'DELETE FROM test WHERE user_id = ?' // not necessary
                const sql4 = 'DELETE FROM assigned_pupil WHERE user_id = ?'
                const sql5 = 'DELETE FROM users WHERE user_id = ?'
                dbconfig.query(sql2, userId, function (err, results, fields) {
                        if (err) throw err;
                        console.log("1 record is deleted");
                        dbconfig.query(sql4, userId, function (err, results, fields) {
                            if (err) throw err;
                            console.log("1 record is deleted");
                            dbconfig.query(sql5, userId, function (err, results, fields) {
                                if (err) throw err;
                                console.log("1 record is deleted");
                                res.status(200).send("Deleted successfully")
                            }
                        );
                        }
                    );
                    }
                );
                
            }
            else {
                if (err) res.status;
                //console.log(res.status(err.status).send(err));
                res.status(404).send('404 Not Found')
                
            }
        }
    );
}
exports.student_view = async (req, res) => {
    const userId = req.params.Id;
        dbconfig.query(
            'SELECT * from assigned_pupil ap INNER JOIN class c on c.class_id = ap.class_id INNER JOIN subject s on s.class_id=c.class_id WHERE ap.user_id = ?', userId,
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
}
exports.onlyTeacher=async (req,res)=>{
    console.log('|Teachers list')
    dbconfig.query(
        `SELECT * FROM users where user_type = "teacher"`,
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
}

exports.studentList=async (req,res)=>{
    console.log('Student list')
    dbconfig.query(
        `SELECT * FROM users where user_type = "student"`,
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
}
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

exports.list_assign_subject = async (req, res) => {
    const userId = req.params.Id; // teacher id
    let response = await fetch('http://localhost:5000/users/show/' + userId);
    let result = await response.json();
    console.log(userId)
    
    if (result[0].user_type == 'teacher') {
        const sqlQry = 'select * from assign_teacher atc INNER JOIN subject s on s.subject_id = atc.subject_id where atc.user_id = ?';
        dbconfig.query(sqlQry, userId, (err, results) => {
            if (err) throw err;
            res.send(results); // results contains rows returned by server
        });
    } else {
        //code for deny permission
        res.status(401).send('401 Unauthorized');
    }
}

exports.list_student_subject = async (req, res) => {
    const userId = req.params.Id; // teacher id
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    let subject_id = req.params.subject_id;

    if (result[0].user_type == 'teacher') {
        const sqlQry = 'SELECT *, (SELECT AVG(m.marks) from mark m INNER JOIN test t on t.test_id = m.test_id WHERE m.user_id = ap.user_id and t.subject_id = ?) as AverageGrade FROM subject s inner join class c on c.class_id = s.class_id inner join assigned_pupil ap on ap.class_id=c.class_id where s.subject_id=?';
        dbconfig.query(sqlQry, [subject_id, subject_id], (err, results) => {
            if (err) throw err;
            res.send(results); // results contains rows returned by server
        });
    } else {
        //code for deny permission
    }
}

exports.get_all_subject_grades = (req, res) => {
    const userId = req.params.Id;
    dbconfig.query(
        'SELECT s.subject_id, (SELECT AVG(m.marks) from mark m INNER JOIN test t on t.test_id = m.test_id where t.subject_id = s.subject_id and m.user_id = ?) as AverageGrade FROM subject s inner join class c on c.class_id = s.class_id inner join assigned_pupil ap on ap.class_id=c.class_id where ap.user_id=?', [userId,userId],
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};