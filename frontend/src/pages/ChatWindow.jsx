import React, { useState } from 'react';

const ChatWindow = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Welcome to the Trade Finance Assistant. How can I help you?' },
  ]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text }]);
    setInput('');
  };

  return (
    <div style={{
      maxWidth: 800,
      margin: '0 auto',
      height: '85vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e0e0e0',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <div style={{ background: '#004a99', color: '#fff', padding: '14px 20px', fontWeight: 600 }}>
        Trade Finance Assistant
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#f5f7fa', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '75%',
              padding: '10px 14px',
              borderRadius: 12,
              fontSize: 14,
              lineHeight: 1.5,
              background: msg.role === 'user' ? '#004a99' : '#fff',
              color: msg.role === 'user' ? '#fff' : '#333',
              border: msg.role === 'bot' ? '1px solid #e0e0e0' : 'none',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: 8, background: '#fff' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about LC, BG, or SWIFT..."
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #ccc',
            borderRadius: 8,
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: '#004a99',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 22px',
            fontSize: 14,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;