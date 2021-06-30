const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const testController = require("../controller/testController");


app.use(express.urlencoded({ extended: true }));

//router.get("test", testController.all_test);

router.delete("/tests/:test_id", testController.deleteTest);
router.get("/tests/details/:Id/:test_id", testController.list_student_test);
router.post("/tests/:subject_id", testController.add_test);
router.put("/tests/:Id", testController.edit_test);
router.post("/tests/importGrades/:Id", testController.upload_csv_grade_pupil);
module.exports = router;