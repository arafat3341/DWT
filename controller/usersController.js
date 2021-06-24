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

exports.login = async (req, res) => {
    let response = await fetch('http://localhost:5000/users');
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
    console.log(getUserId)
    console.log(setUserType)
    console.log(isMatchedUser)
    console.log(storePassword)
    if (isMatchedUser == true && bcrypt.compare(incoming_password, storePassword)) {
        switch (setUserType) {
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
                res.redirect('http://localhost/api/admin.php')
                break;
        }
    }
    else {
        console.log('Auth failed');
        res.status(401).json('Auth failed')
    }
    //res.redirect('/login');
}
exports.getLogin = (req, res) => {
    //res.json("user id:" + getUserId ) 
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(getUserId));
    //getUserId = 0;
    res.end();
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
            const sql = 'update users set user_name = ?, first_name = ?, last_name = ?  where user_id = ?'
            dbconfig.query(sql, [user_name, first_name, last_name, userId], (err, result) => {
                if (err) throw err;
                console.log("1 record updated");
            });
            res.redirect("/api/v1.1/all_users");
            break;
        case 'teacher':
            const sql2 = 'update users set user_name = ?, first_name = ?, last_name = ?  where user_id = ?'
            dbconfig.query(sql2, [user_name, first_name, last_name, userId], (err, result) => {
                if (err) throw err;
                console.log("1 record updated");
            });
            res.redirect("/api/v1.1/all_users");
            break;
        case 'admin':
            const sql3 = 'update users set user_name = ?, first_name = ?, last_name = ?, user_type = ?  where user_id = ?'
            dbconfig.query(sql3, [user_name, first_name, last_name, user_type, userId], (err, result) => {
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
                    sql2, userId, userId, userId, userId,
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

exports.list_of_assign_student = async (req, res) => {
    const userId = req.params.Id;
    let incoming_id = 0;
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    result.forEach(obj => {
        incoming_id = obj.user_id;
    })

    if (incoming_id == userId) {
        switch (result[0].user_type) {
            case 'admin':
                res.json('admin')
                break;
            case 'student':
                //res.json('student')
                //'SELECT u.user_id FROM assigned_pupil ap INNER join users u on ap.user_id = u.user_id WHERE u.user_id = ?'
                dbconfig.query(
                    'SELECT * FROM assigned_pupil ap INNER join class c on ap.class_id = c.class_id WHERE ap.user_id = ?', userId,
                    function (err, results, fields) {
                        res.send(results); // results contains rows returned by server
                    }
                );
                break;
            case 'teacher':
                res.json('teacher')
                break;
        }
    }
    else {
        res.json('not matched')
    }
}
exports.list_of_assign_available_student = async (req, res) => {
    const userId = req.params.Id;
    let incoming_id = 0;
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    result.forEach(obj => {
        incoming_id = obj.user_id;
    })

    if (incoming_id == userId) {
        switch (result[0].user_type) {
            case 'admin':
                res.json('admin')
                break;
            case 'student':
                //res.json('student')
                let assignedClass = 0;
                dbconfig.query(
                    'SELECT c.class_id from class c INNER join assigned_pupil ap on c.class_id = ap.class_id where ap.user_id = ?', userId,
                    function (err, results, fields) {
                        results.forEach(obj => {
                            assignedClass = obj.class_id
                        })
                        console.log(assignedClass)
                        dbconfig.query(
                            'SELECT * from class where not class_id = ?', assignedClass,
                            function (err, results, fields) {
                                res.send(results)
                            }
                        );
                    }
                );
                break;
            case 'teacher':
                res.json('teacher')
                break;
        }
    }
    else {
        res.json('not matched')
    }
}

exports.assign_student_a_class = async (req, res) => {
    const userId = req.params.Id;
    let incoming_id = 0;
    let classID = 1; //req.body.class_id
    let data = {
        class_id: classID,
        user_id: userId
    }
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    switch (result[0].user_type) {
        case 'student':
            let assignedClass = 0;

            dbconfig.query(
                'SELECT c.class_id from class c INNER join assigned_pupil ap on c.class_id = ap.class_id where ap.user_id = ?', userId,
                function (err, results, fields) {
                    results.forEach(obj => {
                        assignedClass = obj.class_id
                    })
                    console.log("assigned class id: " + assignedClass)
                    if (assignedClass == 0) {
                        dbconfig.query(
                            'INSERT INTO assigned_pupil set ?', data,
                            function (err, results, fields) {
                                if (err) throw err;
                                console.log("1 record is Inserted");
                            }
                        );
                        res.redirect("/api/v1/classes/");
                    }
                    else {
                        dbconfig.query(
                            'DELETE FROM `assigned_pupil` where user_id = ?', userId,
                            function (err, results, fields) {
                                if (err) throw err;
                                console.log("1 record is deleted");
                                dbconfig.query(
                                    'INSERT INTO `assigned_pupil` set ?', data,
                                    function (err, results, fields) {
                                        if (err) throw err;
                                        console.log("1 record is inserted");
                                    }
                                );
                            }
                        );
                        res.redirect("/api/v1/classes/");
                    }
                }
            );

            break;
        case 'admin':

            break;
        case 'teacher':

            break;
        default:
            break;
    }

}

exports.deassign_student_a_class = async (req, res) => {
    const userId = req.params.Id;
    let incoming_id = 0;
    let classID = 1; //req.body.class_id
    let data = {
        class_id: classID,
        user_id: userId
    }
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    switch (result[0].user_type) {
        case 'student':
            let assignedClass = 0;

            dbconfig.query(
                'SELECT c.class_id from class c INNER join assigned_pupil ap on c.class_id = ap.class_id where ap.user_id = ?', userId,
                function (err, results, fields) {
                    results.forEach(obj => {
                        assignedClass = obj.class_id
                    })
                    console.log("assigned class id: " + assignedClass)
                    if (assignedClass == 0) {
                        // dbconfig.query(
                        //     'INSERT INTO assigned_pupil set ?', data,
                        //     function (err, results, fields) {
                        //         if (err) throw err;
                        //         console.log("1 record is Inserted");
                        //     }
                        // );
                        res.redirect("/api/v1/classes/");
                    }
                    else {
                        dbconfig.query(
                            'DELETE FROM `assigned_pupil` where class_id = ?', assignedClass,
                            function (err, results, fields) {
                                if (err) throw err;
                                console.log("1 record is deleted");
                                dbconfig.query(
                                    'INSERT INTO `assigned_pupil` set ?', data,
                                    function (err, results, fields) {
                                        if (err) throw err;
                                        console.log("1 record is inserted");
                                    }
                                );
                            }
                        );
                        res.redirect("/api/v1/classes/");
                    }
                }
            );

            break;
        case 'admin':

            break;
        case 'teacher':

            break;
        default:
            break;
    }

}

// --------------------------- sumon ----------------------

exports.list_all_subject = async (req, res) => {
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    if (result[0].user_type == 'admin') {
        dbconfig.query(
            'SELECT s.subject_id, s.subject_name, s.class_id, s.is_archived, c.class_name, c.is_archived, ast.user_id, u.user_name FROM subject s INNER JOIN class c ON s.class_id = c.class_id INNER JOIN assign_teacher ast ON s.subject_id = ast.subject_id INNER JOIN users u ON ast.user_id = u.user_id',
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    } else {
        //code for deny permission
    }

}

exports.addEditSubject = async (req, res) => {
    const userId = req.params.Id;
    const operation_type = req.params.operation_type;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    if (result[0].user_type == 'admin') {
        let lastInsertedID = 0;
        switch (operation_type) {
            case 'addSubject':
                const sql = "INSERT INTO `subject` set ?";
                const insertData = {
                    subject_name: req.body.subject_name,
                    class_id: req.body.class_id,
                    is_archived: 0
                }
                dbconfig.query(sql, insertData, async (err, result) => {
                    if (err) throw err;
                    console.log(result.insertId)
                    lastInsertedID = await result.insertId;
                    console.log("1 record inserted");
                    if (lastInsertedID != 0) {
                        let qry = `INSERT INTO assign_teacher (user_id, subject_id, created_at) VALUES ( ?, ?, ?)`
                        dbconfig.query(qry, [req.body.teacher_id, lastInsertedID, new Date()], function (err, data) {
                            if (err) throw err;
                            console.log("1 record inserted for assign_teacher");
                        });
                    }
                    else {
                        console.log("not working");
                    }
                });

                break;
            case 'editSubject':
                const sqlQry = 'UPDATE subject SET subject_name = ?, class_id = ?  where subject_id = ?';
                let subject_id = req.body.subject_id;
                let subject_name = req.body.subject_name;
                let class_id = req.body.class_id;

                dbconfig.query(sqlQry, [subject_name, class_id, subject_id], (err, result) => {
                    if (err) throw err;
                    console.log("1 record updated");
                });

                let qry = `UPDATE assign_teacher SET user_id = ?  where subject_id = ?`
                dbconfig.query(qry, [req.body.teacher_id, req.body.subject_id], function (err, data) {
                    if (err) throw err;
                    console.log("1 record inserted for assign_teacher");
                });
                break;
            default:
                break;
        }
    }
}
exports.showSubjectInfo = async (req, res) => {
    const userId = req.params.Id;
    const subjectId = req.params.subject_id;
    console.log(userId)
    console.log(subjectId)
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    if (result[0].user_type == 'admin') {
        dbconfig.query(
            'SELECT s.subject_id, s.subject_name, s.is_archived,s.class_id, c.class_name, ast.user_id, u.user_name FROM subject s INNER JOIN class c ON s.class_id = c.class_id INNER JOIN assign_teacher ast ON s.subject_id = ast.subject_id INNER JOIN users u ON ast.user_id = u.user_id WHERE s.subject_id = ?', subjectId,
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    }
}

exports.deleteSubject = async (req, res) => {
    const userId = req.params.Id;
    const subjectId = req.params.subject_id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    console.log(userId)
    console.log(subjectId)

    if (result[0].user_type == 'admin') {
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
    }
}
exports.archiveSubject = async (req, res) => {
    const userId = req.params.Id;
    const subjectId = req.params.subject_id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    console.log(userId)
    console.log(subjectId)
    if (result[0].user_type == 'admin') {
        dbconfig.query(
            'SELECT count(*) AS testCount FROM test WHERE subject_id = ?', subjectId,
            function (err, results, fields) {
                if (err) throw err;
                if (results[0].testCount > 0) {
                    const sqlQry = 'UPDATE subject SET is_archived = ?  where subject_id = ?';
                    dbconfig.query(sqlQry, [1, Number(subjectId)], (err, result) => {
                        if (err) throw err;
                        console.log("1 record updated");
                    });
                } else {
                    console.log("This subject has no test");
                }
            }
        );
    }
}

// ------------------------- end sumon -------------------------------
exports.student_view = async (req, res) => {
    const userId = req.params.Id;
    let userType;
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    result.forEach(obj => {
        userType = obj.user_type
    })
    switch (userType) {
        case 'student':
            dbconfig.query(
                'SELECT * from assigned_pupil ap INNER JOIN subject s on s.subject_id = ap.subject_id where ap.user_id = ?', userId,
                function (err, results, fields) {
                    res.send(results); // results contains rows returned by server
                }
            );
            break;
        case 'admin':
            res.json('admin not allow')
            break;
        case 'teacher':
            res.json('teacher not allow')
            break;
        default:
            res.json('not allow')
            break;
    }
}
//SELECT * from class c INNER join assigned_pupil ap on c.class_id = ap.class_id INNER JOIN subject s on s.class_id = ap.class_id INNER JOIN test t on t.subject_id = s.subject_id where ap.user_id = 32

// --------------------------- sumon teacher view start----------------------
exports.list_student_subject = async (req, res) => {
    const userId = req.params.Id; // teacher id
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    let subject_id = req.params.subject_id;

    if (result[0].user_type == 'teacher') {
        const sqlQry = 'SELECT u.user_name, (SELECT AVG(m.marks) from mark m INNER JOIN test t on t.test_id = m.test_id WHERE m.user_id = u.user_id and t.subject_id = ?) as Avarage_marks from users u INNER JOIN assigned_pupil ap on ap.user_id = u.user_id INNER JOIN assign_teacher atc on atc.subject_id = ap.subject_id WHERE u.user_type = "student" and ap.subject_id = ? and atc.user_id = ?';
        dbconfig.query(sqlQry, [subject_id, subject_id, userId], (err, results) => {
            if (err) throw err;
            res.send(results); // results contains rows returned by server
        });
    } else {
        //code for deny permission
    }

}

exports.add_test = async (req, res) => {
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();
    let userType;
    result.forEach(obj => {
        userType = obj.user_type;
    })
    if (userType == 'teacher') {
        const sql = "INSERT INTO `test` set ?";
        const insertData = {
            test_name: req.body.test_name,
            subject_id: req.params.subject_id,
            date: req.body.test_date,
            is_complete: 0
        }
        dbconfig.query(sql, insertData, async (err, result) => {
            if (err) throw err;
            console.log(result.insertId)
            lastInsertedID = await result.insertId;

            let subjectStudentList = [];

            dbconfig.query(
                'SELECT u.user_id from users u INNER join assigned_pupil ap on u.user_id = ap.user_id where u.user_type = "student" and ap.subject_id = ?', insertData.subject_id,
                function (err, results, fields) {
                    if (results.length > 0) {
                        results.forEach(myFunction);
                        function myFunction(item) {
                            subjectStudentList.push([lastInsertedID, item.user_id, null]);
                        }
                        console.log(subjectStudentList);
                        res.redirect('/users/list_student_subject/' + userId + '/' + insertData.subject_id)
                        // if (lastInsertedID != 0 && subjectStudentList.length > 0) {
                        //     let qry = `INSERT INTO mark (test_id, user_id, marks) VALUES ?`;
                        //     dbconfig.query(qry, [subjectStudentList], function (err, data) {
                        //         if (err) throw err;
                        //         console.log("record inserted for marks");
                        //         console.log(insertData.subject_id);
                        //         res.redirect('/users/list_student_subject/' + userId + '/' + insertData.subject_id)
                        //     });
                        // }
                        // else {
                        //     console.log("not working");
                        // }
                    }
                }
            );

        });
    }
}

exports.edit_test = async (req, res) => {
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();


    if (result[0].user_type == 'teacher') {
        const sqlQry = 'UPDATE test SET test_name = ?, date = ?  where test_id = ?';
        let test_name = req.body.test_name;
        let date = req.body.test_date;
        let test_id = req.body.test_id;
        let subject_id = req.body.subject_id;

        dbconfig.query(sqlQry, [test_name, date, test_id], (err, result) => {
            if (err) throw err;
            console.log("1 record updated");
            res.redirect('/users/list_test_subject/' + userId + '/' + subject_id)
        });
    }
}
exports.list_test_subject = async (req, res) => {
    const userId = req.params.Id;
    const subjectId = req.params.subject_id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();


    if (result[0].user_type == 'teacher') {
        dbconfig.query(
            'SELECT * from test where subject_id = ?', subjectId,
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    } else {
        //code for deny permission
    }
}
exports.list_student_test = async (req, res) => {
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    const test_id = req.params.test_id;

    if (result[0].user_type == 'teacher') {
        dbconfig.query(
            'SELECT u.user_name, u.first_name, u.last_name, t.test_name, mk.marks from users u INNER JOIN mark mk on u.user_id = mk.user_id INNER JOIN test t on t.test_id = mk.test_id where t.test_id = ?', test_id,
            function (err, results, fields) {
                res.send(results); // results contains rows returned by server
            }
        );
    } else {
        //code for deny permission
    }
}

exports.edit_grade_pupil = async (req, res) => {
    const userId = req.params.Id; // teacher id
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    if (result[0].user_type == 'teacher') {
        const sqlQry = 'UPDATE mark SET marks = ? where test_id = ? AND user_id = ?';
        let marks = req.body.grade;
        let user_id = req.body.user_id; // student id
        let test_id = req.body.test_id;

        dbconfig.query(sqlQry, [marks, test_id, user_id], (err, result) => {
            if (err) throw err;
            console.log("Record updated");
            res.redirect('/users/list_student_test/' + userId + '/' + test_id)
        });
    }
}

exports.upload_csv_grade_pupil = async (req, res) => {
    //add validation for file upload first and have to be there a necessary csv file called 'markcsv.csv'
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    if (result[0].user_type == 'teacher') {
        let filepath = './upload/markcsv.csv'
        let filename = filepath;
        //get file
        let stream = fs.createReadStream(filename);
        let csvData = [];
        //parse using fast-csv module; see in top about fastcsv require
        let csvStream = fastcsv.parse()
            .on("data", function (data) {
                csvData.push(data);
            })
            .on("end", function () {
                // remove the first line: header
                csvData.shift();

                // insert csvdata to database
                let qry = `INSERT INTO mark (test_id, user_id, marks) VALUES ?`;
                dbconfig.query(qry, [csvData], function (err, data) {
                    if (err) throw err;
                    console.log(err || data);
                    console.log("record inserted for marks");
                });
            });

        stream.pipe(csvStream);
    }
}

exports.deleteTest = async (req, res) => {
    const userId = req.params.Id;
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    let testId = req.body.test_id;
    const subjectId = req.body.subject_id;
    if (result[0].user_type == 'teacher') {
        const sql = `DELETE FROM mark WHERE test_id = ?`;
        const sql2 = `DELETE FROM test WHERE test_id = ?`;
        dbconfig.query(
            sql, testId,
            function (err, results, fields) {
                if (err) throw err;
                console.log("1 record is deleted");
                dbconfig.query(
                    sql2, testId,
                    function (err, results, fields) {
                        if (err) throw err;
                        console.log("1 record is deleted");
                        res.redirect('/users/list_test_subject/' + userId + '/' + subjectId)
                    }
                );
            }
        );
    }
}

// --------------------------- end sumon teacher view----------------------