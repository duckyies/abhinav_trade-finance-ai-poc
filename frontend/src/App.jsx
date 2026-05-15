import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './pages/ChatWindow';
import FAQManagement from './pages/FAQManagement';

function App() {
  const [page, setPage] = useState('chat');

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar currentPage={page} onNavigate={setPage} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#f5f7fa' }}>
        {page === 'chat' && <ChatWindow />}
        {page === 'faq' && <FAQManagement />}
        {page === 'analytics' && <Placeholder title="Analytics" />}
        {page === 'history' && <Placeholder title="History" />}
      </main>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div style={{ color: '#aaa', fontSize: 18, marginTop: 80, textAlign: 'center' }}>
      {title}
    </div>
  );
}

export default App;