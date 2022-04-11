//mongodb
require("./config/db");

//express server setup
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

//body parser for accepting form data
app.use(cors());
app.use(express.json());

//user routes
const UserRouter = require("./api/User");
app.use("/user", UserRouter);

//donor-location routes
const Search = require("./api/searchDonors");
app.use("/user", Search);

//console server status check
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
