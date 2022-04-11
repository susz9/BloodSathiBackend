const express = require("express");
const router = express.Router();

//mongodb user model
const User = require("./..//models/User");

//password handler
const bcrypt = require("bcrypt");

//signup
router.post("/signup", (req, res) => {
    let {
        fullName,
        phone,
        email,
        password,
        dateOfBirth,
        bloodGroup,
        sex,
        address,
        location,
    } = req.body;
    fullName = fullName.trim();
    email = email.trim();
    password = password.trim();
    phone = phone;
    dateOfBirth = dateOfBirth.trim();
    bloodGroup = bloodGroup.trim();
    sex = sex.trim();
    address = address.trim();
    location = location;

    if (fullName == "" || email == "" || password == "" || dateOfBirth == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!",
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered",
        });
    } else if (!new Date(dateOfBirth)) {
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered",
        });
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short!",
        });
    } else {
        // Checking if user already exists
        User.find({ email })
            .then((result) => {
                if (result.length) {
                    //user already exists
                    res.json({
                        status: "FAILED",
                        message: "User with the provided email already exists",
                    });
                } else {
                    //create new user

                    //password hasing
                    const saltRounds = 10;
                    bcrypt
                        .hash(password, saltRounds)
                        .then((hashedPassword) => {
                            const newUser = new User({
                                fullName,
                                phone,
                                email,
                                password: hashedPassword,
                                dateOfBirth,
                                bloodGroup,
                                sex,
                                address,
                                location,
                            });

                            newUser
                                .save()
                                .then((result) => {
                                    res.json({
                                        status: "SUCCESS",
                                        message: "Signup successful.",
                                        data: result,
                                    });
                                })
                                .catch((err) => {
                                    res.json({
                                        status: "FAILED",
                                        message:
                                            "An error has occured while creating/saving user.",
                                    });
                                });
                        })
                        .catch((err) => {
                            res.json({
                                status: "FAILED",
                                message:
                                    "An error has occured while hashing password.",
                            });
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    status: "FAILED",
                    message:
                        "An error occurred while checking for existing user!",
                });
            });
    }
});

//sign in
router.post("/signin", (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials entered.",
        });
    } else {
        User.find({ email })
            .then((data) => {
                if (data.length) {
                    // user exists
                    const hashedPassword = data[0].password;
                    bcrypt
                        .compare(password, hashedPassword)
                        .then((result) => {
                            if (result) {
                                //password  match
                                res.json({
                                    status: "SUCCESS",
                                    message: "Signin successful.",
                                    data: data,
                                });
                            } else {
                                res.json({
                                    status: "FAILED",
                                    message: "Invalid password entered.",
                                });
                            }
                        })
                        .catch((err) => {
                            res.json({
                                status: "FAILED",
                                message:
                                    "An error occured while comparing password.",
                            });
                        });
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Invalid credentials entered.",
                    });
                }
            })
            .catch((err) => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while checking existing user.",
                });
            });
    }
});

//check account
router.post("/checkUser", (req, res) => {
    let { email, phone } = req.body;
    email = email.trim();

    if (email !== "") {
        User.find({ email })
            .then((data) => {
                if (data.length) {
                    // user exists
                    res.json({
                        status: "SUCCESS",
                        message: "Signin successful.",
                        data: data,
                    });
                } else {
                    res.json({
                        status: "FAILED",
                        message: "User does not exist",
                    });
                }
            })
            .catch((err) => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while checking existing user.",
                });
            });
    } else if (phone !== "") {
        User.find({ phone })
            .then((data) => {
                if (data.length) {
                    // user exists
                    res.json({
                        status: "SUCCESS",
                        message: "Signin successful.",
                        data: data,
                    });
                } else {
                    res.json({
                        status: "FAILED",
                        message: "User does not exist",
                    });
                }
            })
            .catch((err) => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while checking existing user.",
                });
            });
    } else {
        res.json({
            status: "FAILED",
            message: "Empty credentials. Please try Again.",
        });
    }
});

module.exports = router;
