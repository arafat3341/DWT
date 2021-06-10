// const User = require("../models/users.model");
const { request, response } = require("express");
const db = require("../config");
exports.all_users = (request, response) => {
  db.conn.query(
    'SELECT * FROM `users`',
    function (err, results, fields) {
      response.send(results); // results contains rows returned by server
    }
  );
};




