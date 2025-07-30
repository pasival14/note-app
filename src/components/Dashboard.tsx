"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSession, signOut } from "next-auth/react";
import { INote } from "@/models/Notes";

export default function Dashboard() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<INote[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to create note");

      setContent("");
      setShowCreateForm(false);
      fetchNotes();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      return;
    }

    setDeletingNoteId(noteId);
    setError(null);

    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete the note.');
      }
      
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setDeletingNoteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
        </div>
        <button
          onClick={() => signOut()}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Sign Out
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Welcome, {session?.user?.name || "User"}!
          </h2>
          <p className="text-gray-600">
            Email: {session?.user?.email || "xxxxxx@xxxx.com"}
          </p>
        </div>

        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition mb-6"
          >
            Create Note
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Note</h3>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                rows={4}
                disabled={isCreating}
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isCreating || !content.trim()}
                  className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Creating..." : "Save Note"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setContent("");
                  }}
                  className="bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Notes</h3>
          
          <div className="space-y-4">
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <div
                  key={note._id}
                  className="bg-white rounded-lg shadow-sm border p-4 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <p className="text-gray-800">{note.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    disabled={deletingNoteId === note._id}
                    className="ml-4 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Delete note"
                  >
                    {deletingNoteId === note._id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">You have no notes yet.</p>
                <p className="text-gray-400 text-sm">Create your first note to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 