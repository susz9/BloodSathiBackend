const express = require("express");
const router = express.Router();

//mongodb user model
const User = require("./..//models/User");

//return search
router.post("/donors", (req, res) => {
    console.log(req.body);
    let { bloodGroup, coordinates, distance } = req.body;
    let { latitude, longitude } = coordinates;
    bloodGroup = bloodGroup.trim();
    distance = distance.trim();

    const METERS_PER_KM = 1000;
    const options = {
        // isDonor: true,
        // isAvailable: true,
        bloodGroup: bloodGroup,
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                },
                $maxDistance: distance * METERS_PER_KM,
            },
        },
    };

    if (bloodGroup == "" || distance == "") {
        res.json({
            status: "FAILED",
            message: "Empty fields.",
        });
    } else {
        User.find(options)
            .then((data) => {
                if (data.length) {
                    res.json({
                        status: "SUCCESS",
                        message: "Donors found",
                        data: data,
                    });
                } else {
                    res.json({
                        status: "FAILED",
                        message: "No donors found.",
                    });
                }
            })
            .catch((error) =>
                res.json({
                    status: "FAILED",
                    message: "An error occured while searching donors.",
                })
            );
    }
});

module.exports = router;
