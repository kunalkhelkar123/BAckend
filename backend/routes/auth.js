const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

//// Register endpoint

router.post("/register", async (req, res) => {
  const newUser = new User({
    fullname: req.body.fullname,
    email: req.body.email,
    mobile: req.body.mobile,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json("Wrong Credential");
    }

    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
    if (OriginalPassword !== req.body.password) {
      return res.status(401).json("Wrong Credential");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "6d" }
    );

    const { password, ...others } = user._doc;
    return res.status(200).json({ ...others, accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
