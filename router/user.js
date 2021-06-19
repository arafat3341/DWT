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
router.post("/users", userController.addUser);
router.get("/login", userController.getLogin);
router.post("/login", userController.login);
router.post("/register",userController.addUser);
router.get("/users/:Id", userController.edit_user)
router.put("/users/:Id", userController.update_user)
router.delete("/users/:Id", userController.delete_user)
router.get("/users/assignList/:Id", userController.list_of_assign_student)
router.get("/users/assignAvailableList/:Id", userController.list_of_assign_available_student)
router.post("/users/assignStudent/:Id", userController.assign_student_a_class)
router.post("/users/studentView/:Id", userController.student_view)

router.get("/api/v1/all_subjects", subjectController.all_subject);

module.exports = router;