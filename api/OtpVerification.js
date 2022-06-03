const express = require("express");
const router = express.Router();

//twilio and jwt setup
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const crypto = require("crypto");
const smsKey = process.env.SMS_SECRET_KEY;
const twilioNum = process.env.TWILIO_PHONE_NUMBER;
const jwt = require("jsonwebtoken");
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
let refreshTokens = [];

//send OTP API
router.post("/sendOTP", (req, res) => {
    const phone = "+977".concat(req.body.phone);

    console.log(phone);
    const otp = Math.floor(1000 + Math.random() * 9000);
    const ttl = 2 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256", smsKey).update(data).digest("hex");
    const fullHash = `${hash}.${expires}`;

    client.messages
        .create({
            body: `Your OTP For Blood Sathi is ${otp}`,
            from: twilioNum,
            to: phone,
        })
        .then((messages) => {
            if (messages) {
                res.send({
                    status: "SUCCESS",
                    message: "OTP sent",
                    data: messages.to,
                });
            }
        })
        .catch((err) => console.error(err));

    // res.status(200).send({ phone, hash: fullHash, otp });  // this bypass otp via api only for development instead hitting twilio api all the time
    //res.status(200).send({ status: "SUCCESS", phone, hash: fullHash }); // for Production test
});

router.post("/verifyOTP", (req, res) => {
    const phone = req.body.phone;
    const otp = req.body.otp;
    const hash = req.body.hash;
    let [hashValue, expires] = hash.split(".");

    let now = Date.now();
    if (now > parseInt(expires)) {
        return res.status(504).send({ msg: "Timeout. Please try again" });
    }
    let data = `${phone}.${otp}.${expires}`;
    let newCalculatedHash = crypto
        .createHmac("sha256", smsKey)
        .update(data)
        .digest("hex");
    if (newCalculatedHash === hashValue) {
        console.log("user confirmed");
        const accessToken = jwt.sign({ data: phone }, JWT_AUTH_TOKEN, {
            expiresIn: "30s",
        });
        const refreshToken = jwt.sign({ data: phone }, JWT_REFRESH_TOKEN, {
            expiresIn: "1y",
        });
        refreshTokens.push(refreshToken);
        res.status(202)
            .cookie("accessToken", accessToken, {
                expires: new Date(new Date().getTime() + 30 * 1000),
                sameSite: "strict",
                httpOnly: true,
            })
            .cookie("refreshToken", refreshToken, {
                expires: new Date(new Date().getTime() + 31557600000),
                sameSite: "strict",
                httpOnly: true,
            })
            .cookie("authSession", true, {
                expires: new Date(new Date().getTime() + 30 * 1000),
                sameSite: "strict",
            })
            .cookie("refreshTokenID", true, {
                expires: new Date(new Date().getTime() + 31557600000),
                sameSite: "strict",
            })
            .send({ msg: "Device verified" });
    } else {
        console.log("not authenticated");
        res.json({
            status: "FAILED",
            message: "Incorrect OTP.",
        });
    }
});

module.exports = router;
