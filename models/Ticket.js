const mongoose = require("mongoose");
const { MovieSchema } = require("./Movie");
const { TheaterSchema } = require("./Theater");

const TicketSchema = new mongoose.Schema({
  theater: {
    type: TheaterSchema,
  },
  movie: {
    type: MovieSchema,
  },
  seat: {
    type: String,
    required: true,
  },
  isBook: {
    type: Boolean,
    default: false,
  },
});

TicketSchema.method("transform", function () {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

const Ticket = new mongoose.model("Ticket", TicketSchema);

module.exports = {
  TicketSchema,
  Ticket,
};
