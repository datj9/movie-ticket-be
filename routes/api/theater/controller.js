const { Theater } = require("../../../models/Theater");
const ObjectId = require("mongoose").Types.ObjectId;

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
    const errors = {};

    const theater = await Theater.findOne({ name });
    if (theater) return res.status(400).json({ error: "Theater already exists" });

    if (!name) errors.name = "name is required";
    if (!address) errors.address = "address is required";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    if (typeof name != "string") errors.name = "name is invalid";
    if (typeof address != "string") errors.address = "address is invalid";
    if (Object.keys(errors).length) return res.status(400).json(errors);

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
    const errors = {};

    if (!ObjectId.isValid(id)) return res.status(200).json({ id: "Typeof id is not ObjectId" });
    const theater = await Theater.findById(id);
    if (!theater) return res.status(404).json({ error: "Theater not found" });

    if (!name) errors.name = "name is required";
    if (!address) errors.address = "address is required";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    if (typeof name != "string") errors.name = "name is invalid";
    if (typeof address != "string") errors.address = "address is invalid";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    try {
        const updatedTheater = await Theater.findOneAndUpdate({ _id: id }, { name, address }, { new: true });
        return res.status(200).json({ message: "Update theater successfully", theater: updatedTheater.transform() });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteTheater = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) return res.status(200).json({ id: "Typeof id is not ObjectId" });
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
