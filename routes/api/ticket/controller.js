const { Show } = require("../../../models/Show");

const getTickets = async (req, res) => {
    const { showId } = req.query;
    const show = await Show.findById(showId);
    show.tickets.forEach((ticket, index) => (show.tickets[index] = ticket.transform()));
    return res.status(200).json(show.transform());
};

module.exports = {
    getTickets,
};
