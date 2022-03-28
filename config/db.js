require("dotenv").config();
const mongoose = require("mongoose");
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Database connected."))
    .catch((error) => console.log(error));
