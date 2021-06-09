const express = require ("express");
const cors = require("cors");
const app = express();
const users = require("./router/users.route");
const port = 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('',users);

// ----------- server config --------------------
app.listen(port);
// app.listen(port, () =>{
//     console.log("server is running");
// });