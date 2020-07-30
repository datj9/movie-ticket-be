const { Genre } = require("../../../models/Genre");
const isEmpty = require("validator/lib/isEmpty");
const isUrl = require("validator/lib/isURL");

const getGenres = async (req, res) => {
    const genres = await Genre.find();
    const resGenres = [];
    for (const genre of genres) {
        resGenres.push(genre.transform());
    }
    return res.status(200).json(resGenres);
};

const createGenre = async (req, res) => {
    const { name, imageUrl } = req.body;
    const errors = {};

    if (!name) errors.name = "name is required";
    if (!imageUrl) errors.imageUrl = "imageUrl is required";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    if (typeof name != "string") errors.name = "name is invalid";
    if (!isUrl(imageUrl)) errors.imageUrl = "imageUrl is invalid";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    const genre = await Genre.findOne({ name });
    if (genre) return res.status(400).json({ error: "name already exists" });

    const newGenre = new Genre({
        name,
        imageUrl,
    });
    try {
        await newGenre.save();
        return res.status(201).json(newGenre.transform());
    } catch (error) {
        return res.status(500).json(error);
    }
};

const updateGenre = async (req, res) => {
    const { name, imageUrl } = req.body;
    const { id } = req.params;
    const errors = {};

    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).json({ error: "Genre not found" });

    if (!name) errors.name = "name is required";
    if (!imageUrl) errors.imageUrl = "imageUrl is required";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    if (typeof name != "string") errors.name = "name is invalid";
    if (!isUrl(imageUrl)) errors.imageUrl = "imageUrl is invalid";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    try {
        await Genre.updateOne({ _id: id }, { name, imageUrl });
        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteGenre = async (req, res) => {
    const { id } = req.params;
    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).json({ error: "Genre not found" });
    try {
        await Genre.deleteOne({ _id: id });
        return res.status(200).json({ message: "Deleted successfully", id });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

module.exports = {
    getGenres,
    createGenre,
    updateGenre,
    deleteGenre,
};
