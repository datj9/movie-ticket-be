const mongoose = require("mongoose");
const { GenreSchema } = require("./Genre");

const MovieSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        runningTime: {
            type: Number,
            required: true,
        },
        releaseDate: {
            type: Date,
            default: Date.now(),
        },
        genres: {
            type: [GenreSchema],
            required: true,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

MovieSchema.method("transform", function () {
    const obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
});

const Movie = new mongoose.model("Movie", MovieSchema);

module.exports = {
    MovieSchema,
    Movie,
};
