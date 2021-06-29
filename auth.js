const dbconfig = require("./config");
const express = require("express");
const bcrypt = require("bcrypt"); 
exports.auth = function(req,res,next){
    console.log('hi')
    // let getUserId;
    // const sql = "select * from `users` where `user_name` = ?";
    // const user_name = req.body.user_name;
    // const pass = req.body.password;
    // dbconfig.query(sql, user_name, async (err, result) => {
    //     if (err) throw err;
    //     //console.log(result[0].password)
    //     getUserId = result[0].user_id;
    //     const match = await bcrypt.compare(pass, result[0].password);
    //     if (match) {
    //         //res.json(result)
    //         // switch (result[0].user_type) {
    //         // case 'admin':
    //         //     console.log('logged in as a admin');
    //         //     //res.redirect('http://localhost/api/admin.php')
    //         //     next();
    //         //     break;
    //         // case 'teacher':
    //         //     console.log('logged in as a teacher');
    //         //     next();
    //         //     res.redirect('http://localhost/api/teacher.php')
    //         //     break;
    //         // case 'student':
    //         //     console.log('logged in as a student');
    //         //     next();
    //         //     res.redirect('http://localhost/api/student.php')
    //         //     break;
    //         // default:
    //         //     res.json('auth failed')
    //         //     break;
    //         // }
    //         res.writeHead(200, { 'Content-Type': 'application/json' });
    //         res.write(JSON.stringify(getUserId));
    //         //getUserId = 0;
    //         res.end();
    //     }
    //     else res.json('auth failed')
    // });
}