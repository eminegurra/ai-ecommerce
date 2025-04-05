'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const chatContainerRef = useRef(null); // for scrolling

  const sendMessage = async (messageToSend = input) => {
    if (!messageToSend.trim()) return;

    const userMessage = { role: 'user', content: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await res.json();
      const aiMessage = {
        role: 'assistant',
        content: data.reply || 'Something went wrong.',
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Failed to fetch AI response.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-send welcome message
  useEffect(() => {
    if (isOpen && !hasWelcomed) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Hi! What can I help you find today?',
        },
      ]);
      setHasWelcomed(true);
    }
  }, [isOpen, hasWelcomed]);

  // Auto-scroll to bottom on message update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#4B5563',
          color: '#fff',
          fontSize: 26,
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#374151')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#4B5563')}
        aria-label="Open chat"
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
              width: 400,
              height: 500,
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
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'transparent',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                color: '#999',
              }}
              aria-label="Close chat"
            >
              ✖
            </button>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                paddingRight: 5,
                marginTop: 30,
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: 12,
                      background: msg.role === 'user' ? '#0070f3' : '#f1f1f1',
                      color: msg.role === 'user' ? '#fff' : '#000',
                      maxWidth: '80%',
                      wordBreak: 'break-word',
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

            {/* Input */}
            <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 5,
                  border: '1px solid #ccc',
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading}
                style={{
                  background: '#4B5563',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 10px',
                  borderRadius: 5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Send message"
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
