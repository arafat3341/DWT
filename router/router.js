const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const userController = require("../controller/usersController");
const subjectController = require("../controller/subjectController");


app.use(express.urlencoded({ extended: true }));

router.get("/home", (err, res) => {
    res.json({ "message": "ok" });
});
router.get("/api/v1.1/all_users", userController.all_users);
router.post("/users", userController.addUser);
router.get("/login", userController.login);

router.get("/api/v1/all_subjects", subjectController.all_subject);

module.exports = router;