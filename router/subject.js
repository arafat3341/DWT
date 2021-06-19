const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const subjectController = require("../controller/subjectController");


app.use(express.urlencoded({ extended: true }));

router.get("/all_subjects", subjectController.all_subject);
router.post("/singleSubject/:Id", subjectController.single_subject);

module.exports = router;