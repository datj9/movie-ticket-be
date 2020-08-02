const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const { mongoURI } = require("./config");
const mongoURI = "mongodb+srv://tandat198:0842693293@cluster0-gpkmx.mongodb.net/test?retryWrites=true&w=majority";
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ extended: true }));

app.use("/api", cors(), require("./routes/api"));

mongoose.connect(
    mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true },
    () => console.log("Connect to MongoDB successfully")
);

app.listen(port, () => console.log(`Server is running on port ${port}`));
