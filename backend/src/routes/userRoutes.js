const { Router } = require("express");
const { userValidator } = require("../middlewares/validators");
const { userRegister, userLogin } = require("../controllers/userController");
const asyncWrap = require("../utilities/wrapAsync")

const router = Router();

router.route("/profile");
router.route("/login").post(asyncWrap(userLogin));

router.route("/register").post(userValidator, asyncWrap(userRegister));

router.route("/add_to_activity");
router.route("/get_all_activity");

module.exports = router;
