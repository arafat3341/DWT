const express = require ("express");
const cors = require("cors");
const {Pool, Client} = require("pg");

const app = express();
const port = 5000;

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "WMMS",
    password: "3340",
    port: 5432,
});

client.connect((err) => {
    if (err) {
        console.error("connection error", err.stack);
    } else {
        console.log("connected");
    }
});
const query = {
    text: "select * from students",
    // values: [parseInt(request.query.id)],
};
const result = client.query(query,(err,res) => {
    if (err) {
        console.log(err.stack)
    } else {
        console.log(res.rows[1])
    }
});
app.listen(port, () =>{
    console.log("server is running");
});