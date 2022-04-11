const express = require("express");
const router = express.Router();

//mongodb user model
const User = require("./..//models/User");

//return search
router.get("/searchDonors", (req, res) => {
    let { bloodGroup, coordinates, distance } = req.body;
    let [latitude, longitude] = coordinates;
    bloodGroup = bloodGroup.trim();
    distance = distance.trim();

    const options = {
        isDonor: true,
        isAvailable: true,
        bloodGroup: bloodGroup,
        location: {
            $geoWithin: {
                $centerSphere: [[longitude, latitude], distance / 6378.1],
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
