'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);

    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setReply(data.reply || 'Something went wrong.');
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <h1>💬 AI Shopping Assistant</h1>

      <textarea
        placeholder="Ask something like: What can I buy for 1000 euros?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        style={{ width: '100%', padding: 10, fontSize: 16 }}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        style={{ marginTop: 10, padding: '10px 20px', fontSize: 16 }}
      >
        {loading ? 'Thinking...' : 'Ask'}
      </button>

      {reply && (
        <div style={{ marginTop: 20, background: '#f5f5f5', padding: 15 }}>
          <strong>AI Reply:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}
