//mongodb
require("./config/db");

//express server setup
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");

//Express-json body parser for accepting form data
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//user routes
const UserRouter = require("./api/User");
app.use("/user", UserRouter);

//donor-location routes
const Search = require("./api/SearchDonors");
app.use("/user", Search);

//otp
const Otp = require("./api/OtpVerification");
app.use(Otp);

//running server at given port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
