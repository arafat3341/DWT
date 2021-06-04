const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controllers");

router.get("/all_user", usersController.all_users);
router.get('/welcome', (req, res) => {
    res.json({'message': 'ok'});
  })

module.exports = router;