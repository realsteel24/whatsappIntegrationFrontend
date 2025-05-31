import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config";

export default function ChatViewer() {
  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/messages`)
      .then((res) => res.json())
      .then(setMessages);
  }, []);

  const handleReply = async () => {
    if (!replyTo || !replyText) return;
    const res = await fetch(`${BACKEND_URL}/api/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: replyTo, message: replyText }),
    });
    if (res.ok) {
      alert("Message sent!");
      setReplyTo(null);
      setReplyText("");
    } else {
      alert("Failed to send message");
    }
  };

  return (
    <div className="p-4 bg-black text-white h-full">
      <h2 className="text-xl font-bold mb-4">Incoming WhatsApp Messages</h2>
      <ul className="space-y-3">
        {messages.map((msg, i) => (
          <li key={i} className="bg-white/10 p-3 rounded-md">
            <div className="text-sm text-gray-400">{msg.contact_name || msg.phone}</div>
            <div className="text-lg">{msg.content}</div>
            <div className="text-xs text-gray-500">
              {new Date(msg.received_at).toLocaleString()}
            </div>
            <button
              className="mt-2 text-blue-400 underline text-sm"
              onClick={() => {
                setReplyTo(msg.phone);
                setReplyText("");
              }}
            >
              Reply
            </button>
          </li>
        ))}
      </ul>

      {replyTo && (
        <div className="mt-6 bg-white/10 p-4 rounded-md">
          <div className="mb-2 text-sm text-gray-300">
            Replying to: <span className="font-mono">{replyTo}</span>
          </div>
          <textarea
            className="w-full p-2 rounded bg-white/5 text-white mb-2"
            rows="3"
            placeholder="Type your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleReply}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
            >
              Send
            </button>
            <button
              onClick={() => setReplyTo(null)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
