const mongoose = require("mongoose");

const TheaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

TheaterSchema.method("transform", function () {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
});

const Theater = new mongoose.model("Theater", TheaterSchema);

module.exports = {
  TheaterSchema,
  Theater,
};
