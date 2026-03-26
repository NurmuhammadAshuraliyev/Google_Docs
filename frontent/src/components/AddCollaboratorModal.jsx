import { useState } from "react";
import axios from "axios";

export default function AddCollaboratorModal({ noteId, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const add = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notes/${noteId}/collaborators`,
        { email },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      alert("Hamkor muvaffaqiyatli qo‘shildi!");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-3xl w-96">
        <h3 className="text-2xl font-bold mb-6">Hamkor qo‘shish</h3>

        <input
          type="email"
          placeholder="Hamkor emaili"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-6 py-4 bg-gray-800 rounded-2xl mb-6 text-white"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-gray-400 hover:text-white"
          >
            Bekor qilish
          </button>
          <button
            onClick={add}
            disabled={loading}
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl disabled:opacity-50"
          >
            {loading ? "Qo‘shilmoqda..." : "Qo‘shish"}
          </button>
        </div>
      </div>
    </div>
  );
}
