const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const classController = require("../controller/classController");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("", classController.all_class)
router.post("", classController.create_class)
router.get("/:Id", classController.edit_class)
router.put("/:Id", classController.update_class)
router.delete("/:Id", classController.delete_class)
router.post("/:Id/new", classController.doSomething)


module.exports = router;