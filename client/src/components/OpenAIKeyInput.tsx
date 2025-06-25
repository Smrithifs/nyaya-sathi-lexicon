
import React, { useState } from "react";

/**
 * Modal to prompt user for OpenAI API Key (saved in localStorage as "openaiKey").
 */
const OpenAIKeyInput: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [input, setInput] = useState(() => localStorage.getItem("openaiKey") || "");
  const [error, setError] = useState("");

  function saveKey() {
    if (!input || !input.startsWith("sk-")) {
      setError("Please enter a valid OpenAI API key starting with 'sk-'.");
      return;
    }
    localStorage.setItem("openaiKey", input);
    setError("");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full flex flex-col gap-3">
        <h2 className="text-xl font-bold mb-2">Enter your OpenAI API Key</h2>
        <input
          className="border rounded p-2 text-base"
          placeholder="sk-..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2 mt-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            onClick={saveKey}
          >
            Save Key
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Your OpenAI API key is kept in your browser only for this app session.
          <a
            className="text-blue-700 underline ml-1"
            href="https://platform.openai.com/api-keys"
            rel="noopener noreferrer"
            target="_blank"
          >Get your API key</a>
        </div>
      </div>
    </div>
  );
};

export default OpenAIKeyInput;

