import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Save, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function Profile() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl">
        Yuklanmoqda...
      </div>
    );
  }
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        { username: name },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      alert("✅ Username saqlandi!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Xatolik yuz berdi";
      alert("❌ " + errorMsg);
    }
    setSaving(false);
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Yangi parollar mos kelmayapti!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak!");
      return;
    }

    setUpdatingPassword(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      alert("✅ Parol muvaffaqiyatli o‘zgartirildi!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Parolni o‘zgartirishda xatolik!");
    }
    setUpdatingPassword(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={24} />
          Orqaga
        </button>
        <h1 className="text-2xl font-bold">Profil</h1>
      </nav>

      <div className="max-w-2xl mx-auto mt-12 px-6">
        <div className="bg-gray-900 rounded-3xl p-8">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-blue-600 text-white text-6xl font-bold flex items-center justify-center rounded-3xl">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
          </div>

          {/* Username */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Username
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-lg opacity-75 cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-3xl text-lg font-semibold flex items-center justify-center gap-3"
            >
              <Save size={24} />
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>

          {/* Parolni o‘zgartirish */}
          <div className="mt-12 border-t border-gray-700 pt-8">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Lock size={24} /> Parolni o‘zgartirish
            </h2>

            <div className="space-y-6">
              {/* Joriy parol */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Joriy parol
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-blue-500"
                    placeholder="Joriy parolingiz"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showCurrent ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {/* Yangi parol */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Yangi parol
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-blue-500"
                    placeholder="Yangi parol"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNew ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {/* Yangi parolni tasdiqlash */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Yangi parolni tasdiqlang
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-blue-500"
                    placeholder="Yangi parolni qayta kiriting"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleUpdatePassword}
                disabled={updatingPassword}
                className="w-full bg-red-600 hover:bg-red-700 py-5 rounded-3xl text-lg font-semibold flex items-center justify-center gap-3 transition"
              >
                <Lock size={24} />
                {updatingPassword ? "Yangilanmoqda..." : "Parolni yangilash"}
              </button>
            </div>
          </div>
        </div>

        {/* Chiqish */}
        <button
          onClick={logout}
          className="mt-8 w-full text-red-400 hover:text-red-500 py-4 flex items-center justify-center gap-3"
        >
          Chiqish
        </button>
      </div>
    </div>
  );
}
