const express = require("express");
const router = express.Router();

//mongodb user model
const User = require("./..//models/User");

router.get("/donors", (req, res, next) => {
    const { coordinates, distance, bloodGroup } = req.body;
    const { latitude, longitude } = coordinates;
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

    User.find(options).then((data) => {
        res.send(data);
    });
});

module.exports = router;
