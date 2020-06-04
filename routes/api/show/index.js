const router = require("express").Router();
const showController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth");

router.get("/", showController.getShows);
router.post("/", authenticate, authorize(["admin"]), showController.createShow);

module.exports = router;
