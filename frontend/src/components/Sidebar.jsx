import React from 'react';

const menuItems = [
  { key: 'chat', label: 'Chatbot' },
  { key: 'faq', label: 'FAQ Manager' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'history', label: 'History' },
];

const Sidebar = ({ currentPage, onNavigate }) => {
  return (
    <aside style={{
      width: 220,
      background: '#004a99',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{
        padding: '24px 20px',
        fontWeight: 'bold',
        fontSize: 15,
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        letterSpacing: '0.05em',
      }}>
        NEWGEN TRADE AI
      </div>

      <nav style={{ marginTop: 8 }}>
        {menuItems.map((item) => {
          const active = currentPage === item.key;
          return (
            <div
              key={item.key}
              onClick={() => onNavigate(item.key)}
              style={{
                padding: '14px 24px',
                cursor: 'pointer',
                background: active ? '#fff' : 'transparent',
                color: active ? '#004a99' : 'rgba(255,255,255,0.8)',
                fontWeight: active ? 600 : 400,
                borderLeft: active ? '4px solid #4a9eff' : '4px solid transparent',
                fontSize: 14,
                transition: 'background 0.15s',
              }}
            >
              {item.label}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;