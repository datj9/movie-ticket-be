const { Show } = require("../../../models/Show");
const { Theater } = require("../../../models/Theater");
const { Movie } = require("../../../models/Movie");
const { Ticket } = require("../../../models/Ticket");
const Promise = require("bluebird");

const getShows = async (req, res) => {
    const { theaterId, movieId, movie, theater } = req.query;

    if (movie && theater) {
        const theaterRe = new RegExp(theater);
        const movieRe = new RegExp(movie);
        const shows = await Show.find({
            "theater.name": theaterRe,
            "movie.name": movieRe,
        }).select("-tickets");

        shows.forEach(
            (show, i) =>
                (shows[i] = {
                    ...show.transform(),
                    movie: show.movie.transform(),
                    theater: show.theater.transform(),
                })
        );

        return res.status(200).json(shows);
    }

    if (theaterId) {
        const shows = await Show.find().where("theater._id").eq(theaterId).select("-tickets");
        const movies = await Show.find().where("theater._id").eq(theaterId).distinct("movie");

        shows.forEach(
            (show, index) =>
                (shows[index] = {
                    ...show.transform(),
                    movie: show.movie.transform(),
                    theater: show.theater.transform(),
                })
        );
        movies.forEach((movie, index) => {
            movies[index] = movie.transform();
        });

        return res.status(200).json({
            shows,
            movies,
        });
    }

    if (movieId) {
        const shows = await Show.find().where("movie._id").eq(movieId).select("-tickets");
        const theaters = await Show.find().where("movie._id").eq(movieId).distinct("theater");

        shows.forEach(
            (show, index) =>
                (shows[index] = {
                    ...show.transform(),
                    movie: show.movie.transform(),
                    theater: show.theater.transform(),
                })
        );
        theaters.forEach((theater, index) => {
            theaters[index].id = theater._id;
            delete theaters[index]._id;
        });

        return res.status(200).json({
            shows,
            theaters,
        });
    }

    const shows = await Show.find().select(["startTime", "theater", "movie"]);
    const resShows = [];
    for (show of shows) {
        resShows.push({
            ...show.transform(),
            movie: show.movie.transform(),
            theater: show.theater.transform(),
        });
    }
    return res.status(200).json(resShows);
};

const createShow = async (req, res) => {
    const { theaterId, movieId } = req.body;
    const theater = await Theater.findById(theaterId);
    const movie = await Movie.findById(movieId);
    const tickets = [];
    for (let i = 0; i < 8; i++) {
        const rowOfSeat = String.fromCharCode(i + 65);
        for (let j = 1; j < 9; j++) {
            tickets.push(
                new Ticket({
                    seat: rowOfSeat + j,
                })
            );
        }
    }

    try {
        await Promise.map(tickets, function (ticket) {
            return ticket.save();
        });
        const show = new Show({
            theater,
            movie,
            tickets,
        });
        await show.save();

        return res.status(201).json({
            ...show.transform(),
            movie: show.movie.transform(),
            theater: show.theater.transform(),
            numberOfTickets: tickets.length,
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = {
    getShows,
    createShow,
};
