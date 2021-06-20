const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const subjectController = require("../controller/subjectController");


app.use(express.urlencoded({ extended: true }));

router.get("/all_subjects", subjectController.all_subject);
router.post("/singleSubject/:Id", subjectController.single_subject);
router.get("/userSubjects/:Id", subjectController.user_subjects);
router.get("/userSubjectsMeanResults/:Id", subjectController.user_subjects_test_mean);

module.exports = router;