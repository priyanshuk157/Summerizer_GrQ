import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    const res = await fetch("/api/summarize", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setSummary(data.summary);
  };

  const handleSend = async () => {
    await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, summary }),
    });
    alert("Email sent!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          📋 AI Meeting Notes Summarizer
        </h1>

        {/* File Upload */}
        <input
          type="file"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Custom Prompt */}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400"
          rows="3"
          placeholder="Enter custom prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Generate Summary */}
        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          ✨ Generate Summary
        </button>
    
        {/* Summary Box */}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-green-400"
          rows="8"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Recipient email"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSend}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          📧 Send Email
        </button>
      </div>
    </div>
  );
}
