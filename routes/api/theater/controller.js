const { Theater } = require("../../../models/Theater");
const isEmpty = require("validator/lib/isEmpty");

const getTheaters = async (req, res) => {
  const theaters = await Theater.find();
  const resTheaters = [];
  for (const theater of theaters) {
    resTheaters.push(theater.transform());
  }
  return res.status(200).json(resTheaters);
};

const createTheater = async (req, res) => {
  const { name, address } = req.body;
  const theater = await Theater.findOne({ name });
  if (theater) return res.status(400).json({ error: "Theater already exists" });
  if (!name || isEmpty(name))
    return res.status(400).json({ error: "name is required" });
  if (!address || isEmpty(address))
    return res.status(400).json({ error: "address is required" });
  const newTheater = new Theater({
    name,
    address,
  });
  try {
    await newTheater.save();
    return res.status(201).json(newTheater.transform());
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateTheater = async (req, res) => {
  const { name, address } = req.body;
  const { id } = req.params;
  const theater = await Theater.findById(id);
  if (!theater) return res.status(404).json({ error: "Theater not found" });
  try {
    await Theater.updateOne({ _id: id }, { name, address });
    return res.status(200).json({ message: "Update theater successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteTheater = async (req, res) => {
  const { id } = req.params;
  const theater = await Theater.findById(id);
  if (!theater) return res.status(404).json({ error: "Theater not found" });
  try {
    await Theater.deleteOne({ _id: id });
    return res.status(200).json({ message: "Delete theater successfully", id });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getTheaters,
  createTheater,
  updateTheater,
  deleteTheater,
};
