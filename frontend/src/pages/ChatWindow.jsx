import React, { useState, useEffect, useRef } from 'react';
import { findBestMatch } from '../utils/faqMatcher';

const WELCOME =
  'Hi! I am the Trade Finance Assistant. Ask me anything about LC, BG, or any topic in the knowledge base.';

const FALLBACK =
  "I'm sorry, I couldn't find an answer for that. Try asking about LC, BG, or check the FAQ Manager for available topics.";

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const ChatWindow = () => {
  const [faqs, setFaqs] = useState([]);
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: WELCOME, time: getTime() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch('./faqs.json')
      .then((r) => r.json())
      .then((data) => setFaqs(data))
      .catch(() => console.error('Could not load faqs.json'));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const buildBotReply = (userInput) => {
    const { match, suggestions } = findBestMatch(userInput, faqs);

    if (match) {
      let text = match.answer;
      if (suggestions.length > 0) {
        text +=
          '\n\nYou might also be interested in:\n' +
          suggestions.map((s) => `• ${s.question}`).join('\n');
      }
      return text;
    }

    if (suggestions.length > 0) {
      return (
        "I couldn't find an exact match, but here are some related topics:\n" +
        suggestions.map((s) => `• ${s.question}`).join('\n') +
        '\n\nTry asking one of these directly!'
      );
    }

    return FALLBACK;
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now(), role: 'user', text, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botText = buildBotReply(text);
      const botMsg = { id: Date.now() + 1, role: 'bot', text: botText, time: getTime() };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderText = (text) =>
    text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));

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
      <div style={{ background: '#004a99', color: '#fff', padding: '14px 20px', fontWeight: 600, fontSize: 15 }}>
        Trade Finance Assistant
        <span style={{ marginLeft: 10, fontSize: 11, background: '#003a7a', padding: '2px 10px', borderRadius: 20, fontWeight: 400 }}>
          {faqs.length} topics loaded
        </span>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto', padding: 20,
        background: '#f5f7fa', display: 'flex',
        flexDirection: 'column', gap: 14,
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 4 }}>
            <div style={{
              maxWidth: '75%',
              padding: '10px 14px',
              borderRadius: 12,
              fontSize: 14,
              lineHeight: 1.6,
              background: msg.role === 'user' ? '#004a99' : '#fff',
              color: msg.role === 'user' ? '#fff' : '#333',
              border: msg.role === 'bot' ? '1px solid #e0e0e0' : 'none',
              borderTopRightRadius: msg.role === 'user' ? 3 : 12,
              borderTopLeftRadius: msg.role === 'bot' ? 3 : 12,
            }}>
              {renderText(msg.text)}
            </div>
            <span style={{ fontSize: 11, color: '#aaa', paddingLeft: 4, paddingRight: 4 }}>
              {msg.time}
            </span>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              background: '#fff', border: '1px solid #e0e0e0',
              borderRadius: 12, borderTopLeftRadius: 3,
              padding: '10px 16px', display: 'flex', gap: 4, alignItems: 'center',
            }}>
              {[0, 150, 300].map((delay, i) => (
                <span key={i} style={{
                  width: 7, height: 7, borderRadius: '50%', background: '#004a99',
                  display: 'inline-block', opacity: 0.5,
                  animation: `bounce 1s ${delay}ms infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: 8, background: '#fff' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about LC, BG, or SWIFT..."
          style={{
            flex: 1, padding: '10px 14px',
            border: '1px solid #ccc', borderRadius: 8,
            fontSize: 14, outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          style={{
            background: '#004a99', color: '#fff',
            border: 'none', borderRadius: 8,
            padding: '10px 22px', fontSize: 14,
            cursor: 'pointer', fontWeight: 500,
            opacity: !input.trim() || isTyping ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;