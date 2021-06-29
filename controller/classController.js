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
    const classId = req.params.Id;
    const isArchived = req.body.is_archived;
    const sql = 'update class set is_archived = ? where class_id = ?'
    dbconfig.query(sql, [isArchived, classId], (err, result) => {
        if (err) throw err;
        console.log("1 record updated");
    });
    res.redirect("/api/v1/classes/");
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
                                let subjectId = 0;
                                let count = 0;
                                results.forEach(element => {
                                    subjectId = element.subject_id
                                    
                                    dbconfig.query (
                                        'select count(*) as count from test where subject_id = ?', subjectId, function (err, results, fields) {
                                            if (err) throw err;
                                            console.log('count',results[0].count)
                                            if (results[0].count == 0) {
                                                dbconfig.query (
                                                    'delete from subject where subject_id = ?', subjectId, function (err, results, fields) {
                                                        if (err) throw err;
                                                        console.log("1 record is updated");
                                                    }
                                                )
                                                console.log("subject id : "+subjectId);
                                            }
                                            else {
                                                dbconfig.query (
                                                    'update subject set is_archived = ? where subject_id = ?', [1, subjectId], function (err, results, fields) {
                                                        if (err) throw err;
                                                        console.log("1 record is updated");
                                                    }
                                                )
                                                console.log("subject id : "+subjectId);
                                            }
                                        }
                                    )
                                    
                                });
                                // res.redirect('/api/v1/classes/')
                                console.log(results);
                            }
                        )
                    }
                )
        }
    );
    res.redirect("/classes/");
}

 exports.doSomething = async (req,res) => {
    const classId = req.params.Id;
    let response = await fetch('http://localhost:5000/api/v1/classes/'+ classId);
    let result = await response.json();
    res.json(result[0].class_name)
}