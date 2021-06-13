const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const classController = require("../controller/classController");


app.use(express.urlencoded({ extended: true }));

router.get("/api/v1/all_classes", classController.all_class);

module.exports = router;