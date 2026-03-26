import noteService from "../services/note.service.js";

export const createNote = async (req, res) => {
  try {
    const { title } = req.body;
    const note = await noteService.createNote(req.user.id, title);
    return res.status(201).json(note);
  } catch (err) {
    return res.status(500).json({ message: "Server xatoligi" });
  }
};

export const getMyNotes = async (req, res) => {
  try {
    const notes = await noteService.getMyNotes(req.user.id);
    return res.json(notes);
  } catch (err) {
    return res.status(500).json({ message: "Server xatoligi" });
  }
};

export const getNote = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.params.id, req.user.id);
    if (!note) return res.status(404).json({ message: "Note topilmadi" });
    return res.json(note);
  } catch (err) {
    return res.status(500).json({ message: "Server xatoligi" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await noteService.deleteNote(req.params.id, req.user.id);
    return res.json({ message: "O‘chirildi" });
  } catch (err) {
    return res.status(500).json({ message: "Server xatoligi" });
  }
};

export const addCollaborator = async (req, res) => {
  try {
    const { email } = req.body;
    const collab = await noteService.addCollaborator(
      req.params.id,
      req.user.id,
      email,
    );
    return res.json(collab);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateNoteTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const noteId = req.params.id;

    if (!title || title.trim() === "") {
      return res
        .status(400)
        .json({ message: "Title bo‘sh bo‘lishi mumkin emas" });
    }

    const updatedNote = await noteService.updateNoteTitle(
      noteId,
      req.user.id,
      title,
    );
    return res.json(updatedNote);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const comment = await noteService.createComment(
      req.params.id,
      req.user.id,
      req.body.content,
    );
    return res.status(201).json(comment);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await noteService.getComments(req.params.id, req.user.id);
    return res.json(comments);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
