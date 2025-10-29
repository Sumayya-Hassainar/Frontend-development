import React from "react";

const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-1">{note.title}</h3>
      <p className="text-gray-600 mb-2">{note.content}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {note.tags?.map((tag, i) => (
          <span key={i} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onEdit(note)}
          className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note._id)}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
