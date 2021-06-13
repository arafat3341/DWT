const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const testController = require("../controller/testController");


app.use(express.urlencoded({ extended: true }));

router.get("/api/v1/all_test", testController.all_test);

module.exports = router;