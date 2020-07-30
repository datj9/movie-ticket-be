const { Movie } = require("../../../models/Movie");
const { Genre } = require("../../../models/Genre");
const isURL = require("validator/lib/isURL");
const isInt = require("validator/lib/isInt");
const ObjectId = require("mongoose").Types.ObjectId;

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
        if (req.body[field] != "" && !req.body[field]) {
            errors[field] = `${field} is required`;
        }
    }
    if (Object.keys(errors).length === 0) return res.status(400).json(errors);

    if (isURL(imageUrl + "")) {
        errors.imageUrl = "imageUrl must be URL";
    }
    if (!isInt(runningTime + "")) {
        errors.runningTime = "runningTime is invalid";
    }
    if (!Array.isArray(genres) || genres.length == 0) {
        errors.genres = "genres is invalid";
    }
    if (Object.keys(errors).length) return res.status(400).json(errors);

    for (const genreId of genres) {
        if (!ObjectId.isValid(genreId + "")) {
            return res.status(400).json({ genres: "genres is invalid" });
        }
    }

    try {
        const retrievedGenres = await Genre.find().where("_id").in(genres);
        if (retrievedGenres.length !== genres.length) return res.status(400).json({ genres: "genres not found" });

        const movie = new Movie({
            name,
            imageUrl,
            runningTime: parseInt(runningTime),
            description,
            genres: retrievedGenres,
        });
        await movie.save();

        return res.status(201).json(movie.transform());
    } catch (error) {
        return res.status(500).json(error);
    }
};

const updateMovie = async (req, res) => {
    const { id } = req.params;
    const { name, imageUrl, runningTime, genres } = req.body;
    const errors = {};
    const validatedFields = ["name", "imageUrl", "runningTime", "description"];

    for (let field of validatedFields) {
        if (req.body[field] != "" && !req.body[field]) {
            errors[field] = `${field} is required`;
        }
    }

    if (isURL(imageUrl + "")) {
        errors.imageUrl = "imageUrl is invalid";
    }
    if (!isInt(runningTime + "")) {
        errors.runningTime = "runningTime is invalid";
    }
    if (!Array.isArray(genres) || genres.length == 0) {
        errors.genres = "genres is invalid";
    }
    if (typeof description != "string") errors.description = "description is invalid";
    if (Object.keys(errors)) return res.status(400).json(errors);

    for (const genreId of genres) {
        if (!ObjectId.isValid(genreId + "")) {
            return res.status(400).json({ genres: "genres is invalid" });
        }
    }

    try {
        const foundMovie = await Movie.findById(id);
        if (!foundMovie) return res.status(404).json({ error: "Movie not found" });
        const retrievedGenres = await Genre.find({ _id: { $in: genres } });
        if (retrievedGenres.length != genres.length) return res.status(400).json({ genres: "genres not found" });

        await Movie.updateOne(
            { _id: id },
            {
                name,
                imageUrl,
                runningTime: parseInt(runningTime),
                genres: retrievedGenres,
            }
        );
        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteMovie = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(200).json({ id: "Typeof id is not ObjectId" });
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    try {
        await Movie.deleteOne({ _id: id });
        return res.status(200).json({ message: "Deleted movie successfully", id });
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = {
    getMovies,
    createMovie,
    updateMovie,
    deleteMovie,
};
