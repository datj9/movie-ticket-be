const router = require("express").Router();

// router.use("/users", require("./user"));
router.use("/genres", require("./genre"));
router.use("/movies", require("./movie"));
router.use("/theaters", require("./theater"));
router.use("/shows", require("./show"));
router.use("/tickets", require("./ticket"));

module.exports = router;
