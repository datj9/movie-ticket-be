const router = require("express").Router();
const genreController = require("./controller");
const upload = require("../../../middlewares/upload");
const { authenticate, authorize } = require("../../../middlewares/auth");

router.get("/", genreController.getGenres);
router.post("/", authenticate, authorize(["admin"]), genreController.createGenre);
router.post("/uploadGenre", authenticate, authorize(["admin"]), upload.uploadGenreImage);
router.put("/:id", authenticate, authorize(["admin"]), genreController.updateGenre);
router.delete("/:id", authenticate, authorize(["admin"]), genreController.deleteGenre);

module.exports = router;
