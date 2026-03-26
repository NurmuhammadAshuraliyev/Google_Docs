import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2 } from "lucide-react";

export default function NoteList({ notes, refresh }) {
  const navigate = useNavigate();

  const deleteNote = async (id) => {
    if (!confirm("O‘chirishni xohlaysizmi?")) return;
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    refresh();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => navigate(`/note/${note.id}`)}
          className="bg-gray-900 p-6 rounded-3xl hover:bg-gray-800 cursor-pointer transition border border-gray-800 hover:border-blue-500"
        >
          <h3 className="text-2xl font-semibold mb-2">{note.title}</h3>
          <p className="text-gray-400 text-sm">
            Oxirgi o‘zgarish: {new Date(note.updatedAt).toLocaleDateString()}
          </p>
          <div className="flex justify-end mt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              className="text-red-400 hover:text-red-500"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
