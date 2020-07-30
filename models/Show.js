const mongoose = require("mongoose");
const { TheaterSchema } = require("./Theater");
const { MovieSchema } = require("./Movie");
const { TicketSchema } = require("./Ticket");

const ShowSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        require: true,
        default: Date.now(),
    },
    theater: {
        type: TheaterSchema,
    },
    movie: {
        type: MovieSchema,
    },
    tickets: {
        type: [TicketSchema],
    },
});

ShowSchema.method("transform", function () {
    const obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;

    return obj;
});

const Show = new mongoose.model("Show", ShowSchema);

module.exports = {
    ShowSchema,
    Show,
};
