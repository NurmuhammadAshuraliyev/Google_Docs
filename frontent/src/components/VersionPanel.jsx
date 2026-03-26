import { useState, useEffect } from "react";
import axios from "axios";

export default function VersionPanel({ noteId }) {
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setVersions(res.data.versions || []));
  }, [noteId]);

  return (
    <div className="w-96 bg-gray-900 border-l border-gray-800 p-6 overflow-auto">
      <h3 className="font-semibold text-xl mb-6">Oxirgi 5 versiya</h3>
      {versions.map((v) => (
        <div key={v.id} className="mb-6 bg-gray-800 p-4 rounded-2xl">
          <div className="text-sm text-gray-400">
            {new Date(v.changedAt).toLocaleString()}
          </div>
          <div className="text-xs mt-2 text-blue-400">#{v.version} versiya</div>
        </div>
      ))}
    </div>
  );
}
