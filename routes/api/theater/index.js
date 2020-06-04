const router = require("express").Router();
const theaterController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth");

router.get("/", theaterController.getTheaters);
router.post("/", authenticate, authorize(["admin"]), theaterController.createTheater);
router.put("/:id", authenticate, authorize(["admin"]), theaterController.updateTheater);
router.delete("/:id", authenticate, authorize(["admin"]), theaterController.deleteTheater);

module.exports = router;
