const express = require("express");
const router = require("./router/router");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('', router);


app.listen(5000)
{
    console.log("server is running");
};