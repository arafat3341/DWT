const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const testController = require("../controller/testController");


app.use(express.urlencoded({ extended: true }));

router.get("/api/v1/all_test", testController.all_test);
router.get("/api/v1/get_all_subject_grades/:Id", testController.get_all_subject_grades);
module.exports = router;