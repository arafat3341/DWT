const dbconfig = require("../config");
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("../config");
const fetch = require("node-fetch");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

exports.all_class = (req,res) => {
    dbconfig.query(
        'SELECT * FROM `class` where is_archived = 0',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};
exports.create_class = (req,res)=>{
    dbconfig.query(
        'SELECT count(*) AS classCount FROM class WHERE class_name = ?', req.body.class_name,
        function (err, results, fields) {
            if (err) throw err;
            console.log(results[0].classCount)
            if (Number(results[0].classCount) > 0) {
                console.log("This subject has records");
                res.status(409).send('409 CONFLICT');
            } else {
                const sql = "INSERT INTO class set ?";
                const data = {
                    class_name : req.body.class_name
                }
                dbconfig.query(sql, data, (err, result, next) => {
                    if (err) {
                        throw err
                    };
                    console.log("1 record inserted");
                });
                console.log(data)
                //res.json(data)
                res.status(200).send('Class created successfully');
                        }
        }
    );
    
}
exports.edit_class = (req,res)=>{
    const classId = req.params.Id;
    dbconfig.query(
        'SELECT * FROM `class` where class_id = ?', classId,
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
}

exports.update_class = (req,res)=>{
    const user_id = req.params.user_Id;
    const classId = req.params.class_Id;
    const class_name = req.body.class_name;
    console.log(user_id);
    dbconfig.query(
        'SELECT count(*) AS classCount FROM class WHERE class_name = ?', req.body.class_name,
        function (err, results, fields) {
            if (err) throw err;
            console.log(results[0].classCount)
            if (Number(results[0].classCount) > 0) {
                console.log("This subject has records");
                // res.status(409).send('409 CONFLICT');
                res.send(JSON.stringify("not ok"));
            } else {
                const sql = 'update class set class_name = ? where class_id = ?'
                dbconfig.query(sql, [class_name,classId], (err, result) => {
                    if (err) throw err;
                    console.log("1 record updated");
                    console.log(user_id);
                    res.send(JSON.stringify("ok"));
                    // res.redirect('http://localhost/api/admin.php');
                    //res.status(200).send('ok')
                });
            }
        }
    );
    
    
}

exports.delete_class = (req,res)=>{
    const classId = req.params.Id;
    dbconfig.query(
        'DELETE FROM `assigned_pupil` where class_id = ?', classId,
            function (err, results, fields) {
                if (err) throw err;
                console.log("1 record is deleted");
                dbconfig.query (
                    'update class set is_archived = ? where class_id = ?', [1, classId], function (err, results, fields) { // is archiveed = 1 means class deleted
                        if (err) throw err;
                        console.log("1 record is updated");
                        dbconfig.query (
                            'select subject_id from subject where class_id = ?', classId, function (err, results, fields) {
                                if (err) throw err;
                                console.log("1 record is updated");
                                let subjectId = [];
                                let count = 0;
                                results.forEach(element => {
                                    subjectId.push(element.subject_id)
                                });
                                subjectId.forEach(obj=> {
                                    dbconfig.query (
                                        'select count(*) as count from test where subject_id = ?', obj, function (err, results, fields) {
                                            if (err) throw err;
                                            console.log('count',results[0].count)
                                            if (results[0].count == 0) {
                                                dbconfig.query (
                                                    'delete from subject where subject_id = ?', obj, function (err, results, fields) {
                                                        if (err) throw err;
                                                        console.log("1 record is updated");
                                                    }
                                                )
                                                console.log("subject id : "+obj);
                                            }
                                            else {
                                                dbconfig.query (
                                                    'update subject set is_archived = ? where subject_id = ?', [1, obj], function (err, results, fields) {
                                                        if (err) throw err;
                                                        console.log("1 record is updated");
                                                    }
                                                )
                                                console.log("subject id : "+obj);
                                            }
                                        }
                                    )
                                });
                                
                                console.log(subjectId);
                            }
                        )
                    }
                )
        }
    );
    res.redirect("/classes/");
}

exports.assign_student_a_class = async (req, res) => {
    const userId = req.params.Id; // student id
    let classID = req.params.class_id;
    let data = {
        class_id: classID,
        user_id: userId // student id
    }
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/show/' + userId);
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
                        //res.redirect("/api/v1/classes/");
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
                                        let count2=0;
                                        dbconfig.query(
                                            'SELECT DISTINCT s.subject_id from subject s INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN mark m on m.test_id = t.test_id WHERE m.user_id = ?', userId,
                                            function (err, results, fields) {
                                                if (err) throw err;
                                                console.log("1 record is inserted");
                                                results.forEach(obj => {
                                                    count2 = count2 + 1;
                                                })
                                                console.log("counter: ",count2);
                                                if(count2 > 0){
                                                    results.forEach (obj => {
                                                        dbconfig.query(
                                                            'update subject set is_archived = ?  where subject_id = ?', [1,obj.subject_id],
                                                            function (err, results, fields) {
                                                                if (err) throw err;
                                                            }
                                                        );
                                                    })
                                                    console.log('successfully subject archived')
                                                }
                                                // else {
                                                //     results.forEach (obj => {
                                                //         dbconfig.query(
                                                //             'delete from subject where subject_id = ?', obj.subject_id,
                                                //             function (err, results, fields) {
                                                //                 if (err) throw err;
                                                //                 console.log("1 record is deleted");
                                                //             }
                                                //         );
                                                // dbconfig.query(
                                                    //             'delete from class where class_id = ?', classId,
                                                    //             function (err, results, fields) {
                                                    //                 if (err) throw err;
                                                    //                 console.log("1 record is deleted");
                                                    //             }
                                                    //         );
                                                //     })
                                                // }
                                            }
                                        );
                                    }
                                );
                            }
                        );
                        //res.redirect("/api/v1/classes/");
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
    let classID = req.params.class_id; //req.body.class_id
    let data = {
        class_id: classID,
        user_id: userId
    }
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/show/' + userId);
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
                        //res.redirect("/api/v1/classes/");
                        console.log('he dosent assigned to a class before')
                    }
                    else {
                        dbconfig.query(
                            'DELETE FROM `assigned_pupil` where user_id = ? and class_id = ?', [userId,assignedClass],
                            function (err, results, fields) {
                                if (err) throw err;
                                console.log("1 record is deleted");
                                        dbconfig.query(
                                            'SELECT DISTINCT s.subject_id from subject s INNER JOIN test t on t.subject_id = s.subject_id INNER JOIN mark m on m.test_id = t.test_id WHERE m.user_id = ?', userId,
                                            function (err, results, fields) {
                                                if (err) throw err;
                                                console.log("1 record is inserted");
                                                if(results.lenght > 0){
                                                    results.forEach (obj => {
                                                        dbconfig.query(
                                                            'update subject set is_archived = ?  where subject_id = ?', [1,obj.subject_id],
                                                            function (err, results, fields) {
                                                                if (err) throw err;
                                                            }
                                                        );
                                                    })
                                                    console.log('successfully subject archived')
                                                }
                                                // else {
                                                //     results.forEach (obj => {
                                                //         dbconfig.query(
                                                //             'delete from subject where subject_id = ?', obj.subject_id,
                                                //             function (err, results, fields) {
                                                //                 if (err) throw err;
                                                //                 console.log("1 record is deleted");
                                                //             }
                                                //         );
                                                //     })
                                                //     dbconfig.query(
                                                //         'delete from class where class_id = ?', classID,
                                                //         function (err, results, fields) {
                                                //             if (err) throw err;
                                                //             console.log("1 record is deleted");
                                                //         }
                                                //     );
                                                // }
                                            }
                                        );
                                    // }
                            }
                        );
                        //res.redirect("/api/v1/classes/");
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
exports.list_of_assign_student = async (req, res) => {
    const userId = req.params.Id;
    let incoming_id = 0;
    console.log(userId)
    let response = await fetch('http://localhost:5000/users/' + userId);
    let result = await response.json();

    result.forEach(obj => {
        incoming_id = obj.user_id;
    })

    // if (incoming_id == userId) {
        // switch (result[0].user_type) {
            // case 'admin':
            //     res.json('admin')
            //     break;
            // case 'student':
                //res.json('student')
                //'SELECT u.user_id FROM assigned_pupil ap INNER join users u on ap.user_id = u.user_id WHERE u.user_id = ?'
                dbconfig.query(
                    'SELECT * FROM assigned_pupil ap INNER join class c on ap.class_id = c.class_id WHERE ap.user_id = ?', userId,
                    function (err, results, fields) {
                        res.send(results); // results contains rows returned by server
                    }
                );
            //     break;
            // case 'teacher':
            //     res.json('teacher')
            //     break;
        // }
    // }
    // else {
    //     res.json('not matched')
    // }
}
exports.list_of_assign_available_student = async (req, res) => {
    const userId = req.params.Id;
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
}

exports.all_available_subject = (req, res) => {
    class_id = req.params.class_id;
    dbconfig.query(
        'SELECT * FROM `subject` where class_id = ?', class_id,
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
        }
    );
};