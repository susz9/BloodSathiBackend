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
        district,
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
    district = district.trim();
    address = address.trim();
    location = location;
    userSince = new Date();

    if (fullName == "" || email == "" || dateOfBirth == "") {
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
                                district,
                                address,
                                location,
                                userSince,
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

//sign in with credentials
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

//check user account
router.post("/check", (req, res) => {
    let { email, phone } = req.body;

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

//get all users
router.get("/all", async (req, res) => {
    try {
        await User.find()
            .then((data) => {
                if (data.length) {
                    // user exists
                    res.json({
                        status: "SUCCESS",
                        message: "User list",
                        data: data,
                    });
                } else {
                    res.json({
                        status: "FAILED",
                        message: "Users not found",
                    });
                }
            })
            .catch((err) => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while fetching users.",
                });
            });
    } catch (e) {
        res.send(e);
    }
});

//get single users
router.get("/:id", async (req, res) => {
    try {
        await User.findById(req.params.id)
            .then((data) => {
                if (!data.length) {
                    // user exists
                    res.json({
                        status: "SUCCESS",
                        message: "User Details",
                        data: data,
                    });
                } else {
                    res.json({
                        status: "FAILED",
                        message: "User not found",
                    });
                }
            })
            .catch((err) => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while fetching user.",
                });
            });
    } catch (e) {
        res.send(e);
    }
});

//update user
router.put("/update/:id", async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then((data) => {
                console.log(data);
                if (data) {
                    // user exists
                    res.json({
                        status: "SUCCESS",
                        message: "User details updated",
                        data: data,
                    });
                } else {
                    res.json({
                        status: "FAILED",
                        message: "User not found",
                    });
                }
            })
            .catch((err) => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while updating user.",
                });
            });
    } catch (e) {
        res.send(e);
    }
});

//delete user
router.delete("/delete/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
            .then((data) => {
                if (data) {
                    // user exists
                    res.json({
                        status: "SUCCESS",
                        message: "User sucessfuly deleted.",

                        data: data,
                    });
                } else {
                    res.json({
                        status: "FAILED",
                        message: "User deletion failed.",
                    });
                }
            })
            .catch((err) => {
                res.json({
                    status: "FAILED",
                    message: "An error occured fetching user.",
                });
            });
    } catch (e) {
        res.send(e);
    }
});

module.exports = router;
