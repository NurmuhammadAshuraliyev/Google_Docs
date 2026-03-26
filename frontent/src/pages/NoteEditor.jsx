import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "../components/Editor";
import CommentPanel from "../components/CommentPanel";
import OnlineUsers from "../components/OnlineUsers";
import VersionPanel from "../components/VersionPanel";
import AddCollaboratorModal from "../components/AddCollaboratorModal";
import { useSocket } from "../contexts/SocketContext";
import { Users, MessageCircle, History, Share } from "lucide-react";

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();

  const [note, setNote] = useState(null);
  const [content, setContent] = useState({ ops: [{ insert: "\n" }] });
  const [showComment, setShowComment] = useState(false);
  const [showVersion, setShowVersion] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Yangi: sarlavha tahrirlash uchun
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    if (!socket || !id) return;

    socket.emit("join-note", { noteId: id });

    socket.on("online-users", (users) => setOnlineUsers(users));
    socket.on("new-comment", () => {});

    const fetchNote = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notes/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setNote(res.data);
      setContent(res.data.content);
    };
    fetchNote();

    return () => socket.emit("leave-note", { noteId: id });
  }, [id, socket]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const saveTitle = async (newTitle) => {
    if (!newTitle.trim()) newTitle = "Nomsiz hujjat";

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/notes/${id}`,
      { title: newTitle },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    setNote((prev) => ({ ...prev, title: newTitle }));
  };

  const handleTitleSave = () => {
    saveTitle(note.title);
    setIsEditingTitle(false);
  };

  if (!note)
    return (
      <div className="flex items-center justify-center h-screen text-2xl">
        Yuklanmoqda...
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="px-8 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
          {/* ← YANGI CHIROYLI SARLAVHA */}
          <div className="flex-1 max-w-2xl">
            {isEditingTitle ? (
              <input
                type="text"
                value={note.title}
                onChange={(e) => setNote({ ...note, title: e.target.value })}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                }}
                autoFocus
                className="bg-transparent text-4xl font-bold focus:outline-none border-b-2 border-blue-500 w-full"
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="text-4xl font-bold cursor-text hover:text-blue-400 transition-colors"
              >
                {note.title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-4">
            <OnlineUsers users={onlineUsers} />
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-2xl"
            >
              <Share size={20} /> Hamkor qo‘shish
            </button>
            <button
              onClick={() => setShowComment(!showComment)}
              className="flex items-center gap-2 px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-2xl"
            >
              <MessageCircle size={20} /> Izohlar
            </button>
            <button
              onClick={() => setShowVersion(!showVersion)}
              className="flex items-center gap-2 px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-2xl"
            >
              <History size={20} /> Versiyalar
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-auto">
          <Editor
            noteId={id}
            content={content}
            onContentChange={handleContentChange}
          />
        </div>
      </div>

      {/* Sidebar */}
      {showComment && <CommentPanel noteId={id} />}
      {showVersion && <VersionPanel noteId={id} />}

      {/* Modal */}
      {showModal && (
        <AddCollaboratorModal noteId={id} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
