const { Router } = require("express");

const router = Router();

router.route("/profile")
router.route("/login");
router.route("/register");
router.route("/add_to_activity");
router.route("/get_all_activity");

module.exports = router;
