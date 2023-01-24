const User = require("../models/User");
//const Cart = require("../models/Cart");

const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//To register/add user
const registerUser = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    const { password, ...others } = savedUser._doc;
    res.status(201).json({ status: 200, success: true, data: others });
  } catch (err) {
    res.status(500).send(err);
  }
};

//Login User
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    //check user exist or not
    if (!user)
      return res
        .status(401)
        .json({ status: 401, success: false, message: "Wrong Credentials" });
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );

    //check password matches or not
    const originalPasswordString = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (originalPasswordString !== req.body.password)
      return res
        .status(401)
        .json({ status: 401, success: false, message: "Wrong Credentials" });

    const accessToken = jwt.sign(
      {
        id: user._id,
        roles: user.roles,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
    const { password, ...others } = user._doc;
    //send if username and passwords are valid
    res
      .status(200)
      .json({ status: 200, success: true, data: { ...others, accessToken } });
  } catch (err) {
    res.status(500).send(err);
  }
};

//Update User
const updateUser = async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SECRET
          ).toString(),
        },
      },
      { new: true }
    );
    const { password, ...others } = updatedUser._doc;
    res.status(200).json({ status: 200, success: true, data: others });
  } catch (err) {
    res.status(500).json(err);
  }
};

//Delete User
const deleteUser = async (req, res) => {
  try {
    //await Cart.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 200, success: true, data: "User Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

//Get user
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res
        .status(404)
        .json({ status: 404, success: false, message: "User not found!" });

    const { password, ...others } = user._doc;
    res.status(200).json({ status: 200, success: true, data: others });
  } catch (err) {
    res.status(500).json(err);
  }
};

//Get All User
const getAllUsers = async (req, res) => {
  try {
    const query = req.query.new;
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    //const { password, ...others } = user._doc;
    res.status(200).json({ status: 200, success: true, data: users });
  } catch (err) {
    res.status(500).json(err);
  }
};

//Get User Stats

const userStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.getFullYear() - 1);
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({ status: 200, success: true, data });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserDetails,
  getAllUsers,
  userStats,
};
