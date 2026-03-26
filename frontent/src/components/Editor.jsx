import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSocket } from "../contexts/SocketContext";

export default function Editor({ noteId, content, onContentChange }) {
  const quillRef = useRef(null);
  const socket = useSocket();
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = ({ content: newContent }) => {
      if (quillRef.current) {
        quillRef.current.getEditor().setContents(newContent);
      }
    };

    const handleCursor = ({ user, cursor }) => {
      console.log(`${user} kursori:`, cursor);
    };

    socket.on("content-updated", handleUpdate);
    socket.on("cursor-updated", handleCursor);

    return () => {
      socket.off("content-updated", handleUpdate);
      socket.off("cursor-updated", handleCursor);
    };
  }, [socket, noteId]);

  const handleChange = (newContent) => {
    onContentChange(newContent);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      socket?.emit("content-change", { noteId, content: newContent });
    }, 800);
  };

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={content}
      onChange={handleChange}
      className="bg-white text-black rounded-xl shadow-2xl"
      modules={{
        toolbar: ["bold", "italic", "underline", "list", "link", "image"],
      }}
    />
  );
}
