const dbconfig = require("../config");
const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt")

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

exports.all_users = (request, response) => {
    dbconfig.query(
        'SELECT * FROM `users`',
        function (err, results, fields) {
            response.send(results); // results contains rows returned by server
        }
    );
};

exports.login = async (req,res) => {
    let response = await fetch('http://localhost:5000/api/v1.1/all_users');
    let result = await response.json();
    let isMatchedUser = false;
    let storeUserType;
    let storePassword;
    result.forEach(obj => {
        if (obj.user_name == req.body.user_name) {
            isMatchedUser = true;
            storeUserType = obj.user_type;
            storePassword = obj.password;
        }
    })
    
    if (isMatchedUser == true && await await bcrypt.compare(req.body.password, storePassword)) {
        switch (storeUserType) {
            case 'admin':
                console.log('logged in as a admin');
                res.json('logged in as a admin')
                break;
            case 'teacher':
                console.log('logged in as a teacher');
                res.json('logged in as a teacher')
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

function addUser(firstName, lastName, userType, password, userName) {
    const query = `INSERT INTO 'users' 
    VALUES ('user_name','password','first_name','last_name','user_type','created_at')`;
}
function editUser(firstName, lastName, password, userID) {
    const query = `UPDATE users 
    SET 'user_name'='[value-2]',
    'password'='[value-3]',
    'first_name'='[value-4]',
    'last_name'='[value-5]', WHERE 'user_id'='[value-1]'`;
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