const router = require("express").Router();
const ticketController = require("./controller");

router.get("/", ticketController.getTickets);

module.exports = router;
