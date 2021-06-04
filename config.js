const mysql = require("mysql");
// ------------- mysql database connection --------------
const db3 = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password  : '',
    database : 'dwt'
});

db3.connect(function(err) {
    if (err) {
      console.error('error connecting3');
      return;
    }
    console.log('connected3');
  });

module.exports.conn = db3;