const mysql = require("mysql");
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dwt'
});

db.connect()
{
    console.log("conected");
};
module.exports.conn = db;