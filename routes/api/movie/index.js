const router = require("express").Router();
const movieController = require("./controller");
const upload = require("../../../middlewares/upload");
const { authenticate, authorize } = require("../../../middlewares/auth");

router.get("/", movieController.getMovies);
router.post("/", authenticate, authorize(["admin"]), movieController.createMovie);
router.post("/upload-movie", authenticate, authorize(["admin"]), upload.uploadMovieImage);
router.put("/:id", authenticate, authorize(["admin"]), movieController.updateMovie);
router.delete("/:id", authenticate, authorize(["admin"]), movieController.deleteMovie);

module.exports = router;
