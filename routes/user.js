const {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserDetails,
  getAllUsers,
  userStats,
} = require("../controllers/UserController");

const { verifyTokenAndAuthorize } = require("../middleware/auth");

//get router from express
const router = require("express").Router();

//Register
router.post("/register", registerUser);

//Login
router.post("/login", loginUser);

//Update User
router.put("/:id", verifyTokenAndAuthorize(["author", "admin"]), updateUser);

//Delete User
router.delete("/:id", verifyTokenAndAuthorize(["author", "admin"]), deleteUser);

//Get User
router.get("/find/:id", verifyTokenAndAuthorize(["admin"]), getUserDetails);

//Get All User
router.get("/", verifyTokenAndAuthorize(["admin"]), getAllUsers);

//Get User Stats
router.get("/stats", verifyTokenAndAuthorize(["admin"]), userStats);

module.exports = router;
