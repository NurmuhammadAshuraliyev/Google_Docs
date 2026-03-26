import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createNote,
  getMyNotes,
  getNote,
  deleteNote,
  addCollaborator,
  updateNoteTitle,
  createComment,
  getComments,
} from "../controllers/note.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createNote);
router.get("/", getMyNotes);
router.get("/:id", getNote);
router.delete("/:id", deleteNote);
router.post("/:id/collaborators", addCollaborator);
router.put("/:id", updateNoteTitle);

router.post("/:id/comments", createComment);
router.get("/:id/comments", getComments);

export default router;
