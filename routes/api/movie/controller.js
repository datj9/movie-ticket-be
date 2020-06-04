const { Movie } = require("../../../models/Movie");
const { Genre } = require("../../../models/Genre");

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
  const retrievedGenres = await Genre.find().where("name").in(genres);
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
    await Movie.updateOne(
      { _id: id },
      { name, imageUrl, runningTime, retrievedGenres }
    );
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
