const { Movie } = require("../../../models/Movie");
const { Genre } = require("../../../models/Genre");
const isUrl = require("validator/lib/isURL");

const getMovies = async (req, res) => {
    const movies = await Movie.find();
    const resMovies = [];
    for (const movie of movies) {
        resMovies.push(movie.transform());
    }
    return res.status(200).json(resMovies);
};

const createMovie = async (req, res) => {
    const { name, imageUrl, runningTime, genres, description } = req.body;
    const validatedFields = ["name", "imageUrl", "runningTime", "description"];
    const errors = {};
    for (let field of validatedFields) {
        if (!req.body[field] || isEmpty(req.body[field])) {
            errors[field] = `${field} is required`;
        }
    }
    if (Object.keys(errors).length === 0) return res.status(400).json(errors);
    if (isUrl(imageUrl)) {
        errors.imageUrl = "imageUrl must be url";
    }
    if (typeof runningTime != "number") {
        errors.runningTime = "runningTime must be a number";
    }
    if (typeof genres != "object" || !genres.length > 0) {
        errors.genres = "genres is invalid";
    }
    if (Object.keys(errors)) return res.status(400).json(errors);

    const retrievedGenres = await Genre.find().where("_id").in(genres);
    if (retrievedGenres.length === 0) return res.status(400).json({ error: "Please choose valid genres" });
    const movie = new Movie({
        name,
        imageUrl,
        runningTime,
        description,
        genres: retrievedGenres,
    });
    await movie.save();
    return res.status(201).json(movie.transform());
};

const updateMovie = async (req, res) => {
    const { id } = req.params;
    const { name, imageUrl, runningTime, genres } = req.body;
    const retrievedGenres = await Genre.find().where("name").in(genres);
    try {
        await Movie.updateOne({ _id: id }, { name, imageUrl, runningTime, retrievedGenres });
        return res.status(200).json({ message: "Update successfully" });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteMovie = async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    try {
        await Movie.deleteOne({ _id: id });
        return res.status(200).json({ message: "Delete movie successfully", id });
    } catch (error) {
        return res.status(500).json({ error: "Movie not found" });
    }
};

module.exports = {
    getMovies,
    createMovie,
    updateMovie,
    deleteMovie,
};
