const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const subjectController = require("../controller/subjectController");


app.use(express.urlencoded({ extended: true }));

router.get("/all_subjects", subjectController.all_subject);
router.get("/all_subjects/:class_id", subjectController.all_available_subject);
router.get("/singleSubject/:userId/:subjectId", subjectController.single_subject);
router.get("/userSubjects/:Id", subjectController.user_subjects);
router.get("/userSubjectsMeanResults/:Id", subjectController.user_subjects_test_mean);


router.get("/users/list_assign_subject/:Id", subjectController.list_assign_subject);
router.delete("/users/delete_subject/:subject_id", subjectController.deleteSubject);
router.post("/users/assign_teacher/:subject_id", subjectController.assign_teacher);
module.exports = router;