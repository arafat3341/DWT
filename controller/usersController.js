const dbconfig = require("../config");
const { request, response } = require("express");

exports.all_users = (request, response) => {
    dbconfig.conn.query(
        'SELECT * FROM `users`',
        function (err, results, fields) {
            response.send(results); // results contains rows returned by server
        }
    );
};
exports.login = (request, response) => {
    const arr1 = dbconfig.conn.query(
        'SELECT * FROM `users`',
        function (err, results, fields) {
            console
            response.send(results); // results contains rows returned by server
            console.log(results);
            results.forEach(element => {
                //console.log(element.user_name);
                if (element.user_name == 'sana') {
                    switch (element.user_type) {
                        case 'admin':
                            console.log('logged in as a admin');

                            break;
                        case 'teacher':
                            console.log('logged in as a teacher');
                            break;
                        case 'student':
                            console.log('logged in as a student');
                            break;
                        default:
                            break;
                    }
                }
            });
        }
    );

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



// const response = await fetch('http://localhost:5000/api/v1.1/all_users');
// const data = await response.json();

// data.forEach(obj => {
//     Object.entries(obj).forEach(([key, value]) => {
//         console.log(`${key} ${value}`);
//     });
//     console.log('-------------------');
// });