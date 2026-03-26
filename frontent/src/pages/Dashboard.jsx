import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NoteList from "../components/NoteList";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNewNote = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/notes`,
      { title: "Yangi hujjat" },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    navigate(`/note/${res.data.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Mening hujjatlarim</h1>
        <button
          onClick={createNewNote}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-3xl text-lg font-medium"
        >
          <Plus size={24} /> Yangi hujjat
        </button>
      </div>
      <NoteList notes={notes} refresh={fetchNotes} />
    </div>
  );
}
