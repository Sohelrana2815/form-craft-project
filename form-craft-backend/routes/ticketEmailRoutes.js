const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");

router.post("/send-ticket-email", ticketController.sendTicketEmail);

module.exports = router;
