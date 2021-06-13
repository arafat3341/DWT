const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const subjectController = require("../controller/subjectController");


app.use(express.urlencoded({ extended: true }));

router.get("/api/v1/all_subjects", subjectController.all_subject);

module.exports = router;