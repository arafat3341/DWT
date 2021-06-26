const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const classController = require("../controller/classController");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/classes", classController.all_class)
router.post("/classes", classController.create_class)
router.get("/classes/:Id", classController.edit_class)
router.put("/classes/:Id", classController.update_class)
router.delete("/classes/:Id", classController.delete_class)
router.post("/classes/:Id/new", classController.doSomething)


module.exports = router;