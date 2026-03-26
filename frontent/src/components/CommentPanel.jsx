import { useState, useEffect } from "react";
import axios from "axios";
import { useSocket } from "../contexts/SocketContext";
import { Send } from "lucide-react";

export default function CommentPanel({ noteId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const socket = useSocket();

  const fetchComments = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/notes/${noteId}/comments`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    setComments(res.data);
  };

  useEffect(() => {
    fetchComments();
    socket?.on("new-comment", (comment) => {
      setComments((prev) => [...prev, comment]);
    });
  }, [noteId]);

  const sendComment = async () => {
    if (!newComment.trim()) return;
    socket?.emit("add-comment", { noteId, content: newComment });
    setNewComment("");
    fetchComments();
  };

  return (
    <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800 font-semibold text-xl">
        Izohlar
      </div>
      <div className="flex-1 p-6 overflow-auto space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-800 p-4 rounded-2xl">
            <div className="flex justify-between text-sm">
              <span className="font-medium">@{c.user.username}</span>
              <span className="text-gray-400">
                {new Date(c.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-2">{c.content}</p>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Izoh yozing..."
            className="flex-1 bg-gray-800 px-5 py-4 rounded-3xl focus:outline-none"
          />
          <button
            onClick={sendComment}
            className="bg-blue-600 px-6 rounded-3xl"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
