const express = require("express");
const app = express();
const port = 5000;
const router = require("./router/router");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('', router);

app.listen(port, (err) => {
    if(err) {
        res.sendStatus(500).send(err);
    }
    console.log(`Example app listening at http://localhost:${port}`)
});