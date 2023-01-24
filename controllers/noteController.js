const Note = require("../models/note");

const noteNotFound = (req, res) => {
  return res
    .status(404)
    .json({ status: 404, success: false, message: "Note not found!" });
};

//Create Note
const addNote = async (req, res) => {
  const newNote = new Note({ ...req.body, author: req.user.id });
  try {
    const savedNote = await newNote.save();
    res.status(200).json({ status: 200, success: true, data: savedNote });
  } catch (err) {
    res.status(500).send(err);
  }
};

//Update Note
const updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.noteId,
        author: req.user.id,
      },
      { $set: req.body },
      { new: true }
    );
    if (!updatedNote) {
      noteNotFound(req, res);
      return;
    }
    res.status(200).json({ status: 200, success: true, data: updatedNote });
  } catch (err) {
    res.status(500).json(err);
  }
};

//Delete Note
const deleteNote = async (req, res) => {
  try {
    await Note.findOneAndDelete({
      _id: req.params.noteId,
      author: req.user.id,
    });

    res.status(200).json({ status: 200, success: true, data: "Note Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

//Get Note by id
const getNoteDetails = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.noteId,
      author: req.user.id,
    });
    if (!note) {
      noteNotFound(req, res);
      return;
    }
    res.status(200).json({ status: 200, success: true, data: note });
  } catch (err) {
    res.status(500).json(err);
  }
};

//Get Note by id
const getNotes = async (req, res) => {
  try {
    const note = await Note.find({
      author: req.user.id,
    });
    if (!note) {
      noteNotFound(req, res);
      return;
    }
    res.status(200).json({ status: 200, success: true, data: note });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  addNote,
  updateNote,
  deleteNote,
  getNoteDetails,
  getNotes,
};
