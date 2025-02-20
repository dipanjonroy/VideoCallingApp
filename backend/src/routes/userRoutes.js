const { Router } = require("express");
const { userValidator } = require("../middlewares/validators");
const { userRegister } = require("../controllers/userController");

const router = Router();

router.route("/profile");
router.route("/login");

router.route("/register").post(userValidator, userRegister);

router.route("/add_to_activity");
router.route("/get_all_activity");

module.exports = router;
