const dbconfig = require("../config");
const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    
exports.all_users = (req, res) => {
    dbconfig.query(
        'SELECT * FROM `users`',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};
let getUserId;
let setUserId = [];
let setUserType = [];
let isMatchedUser = false;
let storePassword;
let incoming_password; 
exports.login = async (req,res) => {
    let response = await fetch('http://localhost:5000/api/v1.1/all_users');
    let result = await response.json();
    result.forEach(obj => {
        if (obj.user_name == req.body.user_name) {
            isMatchedUser = true;
            setUserType = obj.user_type;
            storePassword = obj.password;
            getUserId = obj.user_id;
            setUserId[0] = (obj.user_id)
        }
    })
    incoming_password = req.body.password;
    console.log(setUserId)
    console.log(setUserType)
    console.log(isMatchedUser)
    console.log(storePassword)
    res.sendStatus(200)
}
    exports.getLogin = async (req, res) => {
        //res.send(200).json("user name:" + setUserId ) 
        //res.send(setUserId)
        if (isMatchedUser == true && await bcrypt.compare(incoming_password, storePassword)) {
            switch (setUserType) {
                case 'admin':
                    console.log('logged in as a admin');
                    res.json('logged in as a admin')
                    break;
                case 'teacher':
                    console.log('logged in as a teacher');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify(await getUserId));
                    res.end();
                    break;
                case 'student':
                    console.log('logged in as a student');
                    res.json('logged in as a student')
                    break;
                default:
                    break;
            }
        }
        else {
            console.log('Auth failed');
            res.status(401).json('Auth failed')
        }
    }
    exports.addUser = async (req,res) => {
        const sql = "INSERT INTO users set ?";
        const hash2 = await bcrypt.hash(req.body.password, 10);
        const data = {
            user_name : req.body.user_name,
            password : hash2,
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            user_type : req.body.user_type,
            created_at : new Date()
        }
        dbconfig.query(sql, data, (err, result) => {
            if (err) throw err;
            console.log("1 record inserted");
        });
    console.log(data)
    //res.json(data)
    res.redirect("/api/v1.1/all_users");
    }
function editUser(firstName, lastName, password, userID) {
    const query = `UPDATE users 
    SET 'user_name'=?,
    'password'=?,
    'first_name'=?,
    'last_name'=?, WHERE 'user_id'=?`;
}
function deleteUser(userID) {

    const userType = `SELECT 'user_type' FROM 'users' WHERE 'user_id'='[value-1]'`;
    if (userType === "student") {
        'DELETE FROM `mark` WHERE user_id = "incomingID"';
        'DELETE FROM `test` WHERE user_id = "incomingID"';
        'DELETE FROM `assign_pupil` WHERE user_id = "incomingID"';
        'DELETE FROM `users` WHERE user_id = "incomingID"';
    }
    else {
        const notArchivedCount = `SELECT count(*)
        FROM subject
        INNER JOIN assign_teacher
        ON subject.subject_id = assign_teacher.subject_id 
        where assign_teacher.user_id = "incomingID" 
        and subject.is_archived = '0'`;
        if (notArchivedCount == 0) {
            'DELETE FROM `assign_teacher` WHERE user_id = "incomingID"';
            'DELETE FROM `users` WHERE user_id = "incomingID"';
        }
    }
}

exports.edit_user = (req,res)=>{
    const userId = req.params.Id;
    dbconfig.query(
        'SELECT * FROM `users` where user_id = ?', userId,
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
}
exports.update_user = (req,res)=>{
    const userId = req.params.Id;
    const user_name = req.body.user_name;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const user_type = req.body.user_type;

    const sql = 'update users set user_name = ?, first_name = ?, last_name = ?, user_type = ?  where user_id = ?'
    dbconfig.query(sql, [user_name, first_name, last_name, user_type, userId], (err, result) => {
        if (err) throw err;
        console.log("1 record updated");
    });
    res.redirect("/api/v1.1/all_users");
}
exports.delete_user = (req,res) => {
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
                            res.redirect("/api/v1.1/all_users");
                        }
                        else {
                            res.sendStatus(401)
                        }
                    }
                );
            }
            else if (userType === "student") {
                const sql2 = `DELETE FROM mark WHERE user_id = ?, 
                DELETE FROM test WHERE user_id = ? ,
                DELETE FROM assign_pupil WHERE user_id = ? ,
                DELETE FROM users WHERE user_id = ?`;
                dbconfig.query(
                    sql2,userId,userId,userId,userId,
                    function (err, results, fields) {
                        if (err) throw err;
                            console.log("1 record is deleted");
                    }
                );
                res.redirect("/api/v1.1/all_users");
            }
            else {
                if (err) throw err;
                console.log(userType);
            }
        }
    );
    
    
}

exports.list_of_assign_student = async (req,res) => {
    const userId = req.params.Id;
    let incoming_id = 0;
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/'+userId);
    let result = await response.json();
    
    result.forEach(obj => {
        incoming_id = obj.user_id;
    })

    if (incoming_id == userId) {
        switch (result[0].user_type) {
            case 'admin' :
                res.json('admin')
                break;
            case 'student' :
                //res.json('student')
                //'SELECT u.user_id FROM assigned_pupil ap INNER join users u on ap.user_id = u.user_id WHERE u.user_id = ?'
                dbconfig.query(
                    'SELECT * FROM assigned_pupil ap INNER join class c on ap.class_id = c.class_id WHERE ap.user_id = ?', userId,
                    function (err, results, fields) {
                        res.send(results); // results contains rows returned by server
                    }
                );
                break;
            case 'teacher' :
                res.json('teacher')
                break;
        }
    }
    else {
        res.json('not matched')
    }
}
exports.list_of_assign_available_student = async (req,res) => {
    const userId = req.params.Id;
    let incoming_id = 0;
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/'+userId);
    let result = await response.json();
    
    result.forEach(obj => {
        incoming_id = obj.user_id;
    })

    if (incoming_id == userId) {
        switch (result[0].user_type) {
            case 'admin' :
                res.json('admin')
                break;
            case 'student' :
                //res.json('student')
                let assignedClass = 0;
                dbconfig.query(
                    'SELECT c.class_id from class c INNER join assigned_pupil ap on c.class_id = ap.class_id where ap.user_id = ?',userId,
                    function (err, results, fields) {
                        results.forEach(obj=>{
                            assignedClass = obj.class_id
                        })
                        console.log(assignedClass)
                        dbconfig.query(
                            'SELECT * from class where not class_id = ?',assignedClass,
                            function (err, results, fields) {
                                res.send(results)
                            }
                        );
                    }
                );
                break;
            case 'teacher' :
                res.json('teacher')
                break;
        }
    }
    else {
        res.json('not matched')
    }
}

exports.assign_student_a_class = async (req,res) => {
    const userId = req.params.Id;
    let incoming_id = 0;
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/'+userId);
    let result = await response.json();
    res.send(result)
}