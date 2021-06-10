const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controllers");
//const classesController = require("../controllers/classes.controllers");


router.get("/all_user", usersController.all_users);

//router.get("/all_class", classesController.all_classes);

//router.get("/all_subject", classesController.all_subjects);

router.get('/welcome', (req, res) => {
  res.json({ 'message': 'ok' });
})

module.exports = router;