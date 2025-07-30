"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { INote } from "@/models/Notes";

export default function NoteManager() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<INote[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch notes
  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle note creation
  const handleCreateNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to create note");

      setContent(""); // Clear input field
      fetchNotes(); // Re-fetch notes to show the new one
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  
  // Handle note deletion
  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete the note.');
      }
      // Remove the note from the local state to update UI instantly
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };


  if (isLoading) return <p>Loading notes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      {/* Welcome Message */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold">Welcome, {session?.user?.name}!</h2>
        <p className="text-gray-600">Email: {session?.user?.email}</p>
      </div>

      {/* Create Note Form */}
      <form onSubmit={handleCreateNote} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          rows={4}
        ></textarea>
        <button
          type="submit"
          className="mt-2 w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
        >
          Create Note
        </button>
      </form>

      {/* Notes List */}
      <div>
        <h3 className="text-xl font-bold mb-4">Notes</h3>
        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note._id}
                className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <p className="text-gray-800 flex-1">{note.content}</p>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="ml-4 text-gray-500 hover:text-red-500"
                  aria-label="Delete note"
                >
                   {/* Basic delete icon */}
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">You have no notes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}