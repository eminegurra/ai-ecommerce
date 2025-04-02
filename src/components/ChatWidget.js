'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const aiMessage = { role: 'assistant', content: data.reply || 'Something went wrong.' };

    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#0070f3',
          color: '#fff',
          fontSize: 26,
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        💬
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 90,
              right: 20,
              width: 320,
              height: 400,
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: 10,
              padding: 10,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 0 10px rgba(0,0,0,0.2)',
              zIndex: 1000,
            }}
          >
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 5 }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: 12,
                      background: msg.role === 'user' ? '#0070f3' : '#eee',
                      color: msg.role === 'user' ? '#fff' : '#000',
                      maxWidth: '80%',
                    }}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
              {loading && (
                <div style={{ fontStyle: 'italic', color: '#999' }}>
                  AI is typing...
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 5 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 5,
                  border: '1px solid #ccc',
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                style={{
                  background: '#0070f3',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 5,
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
