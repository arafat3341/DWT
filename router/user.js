const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const userController = require("../controller/usersController");
const subjectController = require("../controller/subjectController");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/home", (err, res) => {
    res.json({ "message": "ok" });
});
router.get("/users", userController.all_users);
router.get("/users/onlyTeacher", userController.onlyTeacher);
router.get("/users/studentList", userController.studentList);
router.post("/users", userController.addUser);
router.get("/login", userController.getLogin);
router.post("/login", userController.login);
router.post("/register", userController.addUser);
router.get("/users/:Id", userController.edit_user)
router.put("/users/:Id", userController.update_user)
router.delete("/users/:Id", userController.delete_user)
router.get("/users/assignList/:Id", userController.list_of_assign_student)
router.get("/users/assignAvailableList/:Id", userController.list_of_assign_available_student)
router.post("/users/assignStudent/:Id/:class_id", userController.assign_student_a_class)
router.post("/users/deassignStudent/:Id/:class_id", userController.deassign_student_a_class)
router.get("/users/studentView/:Id", userController.student_view)

router.get("/api/v1/all_subjects", subjectController.all_subject);

router.get("/users/sub_list/:Id", userController.list_all_subject);
//router.post("/users/add_subject/:Id", userController.addEditSubject);
router.post("/users/add_edit_subject/:operation_type", userController.addEditSubject);
router.get("/users/archive_subject/:subject_id", userController.archiveSubject);

router.get("/users/edit_subject/:Id/:subject_id", userController.showSubjectInfo);

// route added 6/22
router.get("/users/list_student_subject/:Id/:subject_id", userController.list_student_subject);
router.post("/users/add_test/:subject_id", userController.add_test);
router.put("/users/edit_test/:Id", userController.edit_test);

router.get("/users/list_test_subject/:Id/:subject_id", userController.list_test_subject);
router.get("/users/list_student_test/:Id/:test_id", userController.list_student_test);

router.put("/users/edit_grade_pupil/:Id", userController.edit_grade_pupil);
router.get("/users/upload_csv_grade_pupil/:Id", userController.upload_csv_grade_pupil);
router.delete("/users/deleteTest/:test_id", userController.deleteTest);



module.exports = router;