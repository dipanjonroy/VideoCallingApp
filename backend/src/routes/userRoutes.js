const { Router } = require("express");
const { userValidator } = require("../middlewares/validators");
const {
  userRegister,
  userLogin,
  profile,
  logOut,
} = require("../controllers/userController");
const asyncWrap = require("../utilities/wrapAsync");
const { isLoggedIn, isLoggedOut } = require("../middlewares/authValidator");
const wrapAsync = require("../utilities/wrapAsync");

const router = Router();

router
  .route("/register")
  .post(isLoggedOut, userValidator, asyncWrap(userRegister));

router.route("/login").post(isLoggedOut, asyncWrap(userLogin));

router.route("/logout").get(isLoggedIn, wrapAsync(logOut));

router.route("/profile").get(isLoggedIn, asyncWrap(profile));

router.route("/add_to_activity");
router.route("/get_all_activity");

module.exports = router;
