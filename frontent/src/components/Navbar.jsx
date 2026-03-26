import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Agar foydalanuvchi login qilmagan bo'lsa → faqat logo
  if (!user) {
    return (
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center">
        <Link
          to="/"
          className="text-2xl font-bold flex items-center gap-2 text-white"
        >
          📝 CollabDocs
        </Link>
      </nav>
    );
  }

  // Login qilgan bo'lsa → to'liq navbar
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold flex items-center gap-2 text-white"
      >
        📝 CollabDocs
      </Link>

      <div className="flex items-center gap-4">
        {/* Barcha hujjatlar */}
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
        >
          Barcha hujjatlar
        </button>

        {/* ==================== PROFIL DROPDOWN ==================== */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 rounded-2xl transition-colors"
          >
            {/* Avatar */}
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border border-gray-700"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 text-white text-lg font-semibold flex items-center justify-center rounded-full">
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
            )}

            <div className="text-left">
              <p className="text-sm font-medium text-white">
                {user?.name || "Foydalanuvchi"}
              </p>
              <p className="text-xs text-gray-400">{user?.email || ""}</p>
            </div>

            <ChevronDown size={18} className="text-gray-400" />
          </button>

          {/* Dropdown menyusi */}
          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl py-3 z-50"
              onClick={() => setShowDropdown(false)}
            >
              {/* Foydalanuvchi ma'lumotlari */}
              <div className="px-5 py-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-600 text-white text-3xl font-bold flex items-center justify-center rounded-2xl">
                      {user?.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{user?.name}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Profilni ko'rish */}
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-5 py-3 hover:bg-gray-800 flex items-center gap-3 text-white"
              >
                <User size={20} />
                Profilni ko‘rish / tahrirlash
              </button>

              {/* Chiqish */}
              <button
                onClick={logout}
                className="w-full text-left px-5 py-3 hover:bg-gray-800 flex items-center gap-3 text-red-400"
              >
                <LogOut size={20} />
                Chiqish
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
