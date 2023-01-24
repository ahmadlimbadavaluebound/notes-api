const router = require("express").Router();

const userRoute = require("./user");
const noteRoute = require("./note");

//use routes
router.use("/api/users", userRoute);
router.use("/api/note", noteRoute);

module.exports = router;
