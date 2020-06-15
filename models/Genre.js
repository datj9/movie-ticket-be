const mongoose = require("mongoose");

const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

GenreSchema.method("transform", function () {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
});

const Genre = new mongoose.model("Genre", GenreSchema);

module.exports = {
  GenreSchema,
  Genre,
};
