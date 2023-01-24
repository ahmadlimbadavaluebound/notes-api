const { verifyTokenAndAuthorize } = require("../middleware/auth");

const {
  addNote,
  updateNote,
  deleteNote,
  getNoteDetails,
  getNotes,
} = require("../controllers/noteController");

//get router from express
const router = require("express").Router();

//add note
router.post("/", verifyTokenAndAuthorize(["author", "admin"]), addNote);

router.put(
  "/:noteId",
  verifyTokenAndAuthorize(["author", "admin"]),
  updateNote
);

router.delete(
  "/:noteId",
  verifyTokenAndAuthorize(["author", "admin"]),
  deleteNote
);

router.get(
  "/:noteId",
  verifyTokenAndAuthorize(["author", "admin"]),
  getNoteDetails
);

router.get("/", verifyTokenAndAuthorize(["author", "admin"]), getNotes);

module.exports = router;
