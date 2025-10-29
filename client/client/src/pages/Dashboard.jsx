import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import NoteCard from "../components/NoteCard";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    const res = await API.get("/notes");
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()) };

    if (editingId) {
      await API.put(`/notes/${editingId}`, payload);
      setEditingId(null);
    } else {
      await API.post("/notes", payload);
    }
    setForm({ title: "", content: "", tags: "" });
    fetchNotes();
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content, tags: note.tags.join(", ") });
    setEditingId(note._id);
  };

  const handleDelete = async (id) => {
    await API.delete(`/notes/${id}`);
    fetchNotes();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Note form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-6">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Add"} Note
        </button>
      </form>

      {/* Notes list */}
      <div className="grid gap-4 md:grid-cols-2">
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
