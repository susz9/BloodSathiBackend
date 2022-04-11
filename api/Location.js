const express = require("express");
const router = express.Router();

//mongodb user model
const User = require("./..//models/User");

router.get("/donors", async (req, res, next) => {
    const { bloodGroup, coordinates, distance } = req.body;
    const [latitude, longitude] = coordinates;

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

    await User.find(options)
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
});

module.exports = router;
