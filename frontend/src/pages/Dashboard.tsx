import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

interface Note {
  _id: string;
  content: string;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      // Fetch notes
      api
        .get("/notes", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setNotes(res.data))
        .catch(() => console.log("Failed to fetch notes"));

      // Fetch user profile
      api
        .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data))
        .catch(() => console.log("Failed to fetch user"));
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await api.post(
        "/notes",
        { content: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([res.data, ...notes]);
      setNewNote("");
    } catch {
      alert("Failed to add note");
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
    } catch {
      alert("Failed to delete note");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-blue-500 hover:underline"
        >
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center p-6">
        {/* Welcome Card */}
        <div className="bg-white p-5 rounded-xl shadow-md w-full max-w-md text-center mb-4">
          <h2 className="text-lg font-semibold">
            Welcome, {user?.name || "User"} !
          </h2>
          <p className="text-gray-600 text-sm">
            Email: {user?.email ? `xxxxxx@xxxx.com` : "Loading..."}
          </p>
        </div>

        {/* Create Note Button */}
        <div className="w-full max-w-md mb-6">
          <button
            onClick={addNote}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Create Note
          </button>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note..."
            className="mt-3 w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Notes List */}
        <div className="w-full max-w-md">
          <h3 className="font-medium mb-2">Notes</h3>
          <ul className="space-y-2">
            {notes.map((note) => (
              <li
                key={note._id}
                className="flex justify-between items-center bg-white p-3 rounded shadow-sm"
              >
                <span>{note.content}</span>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="text-red-500 hover:underline"
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
