import React, { useState, useEffect } from 'react';

const EMPTY_FORM = { keyword: '', question: '', answer: '' };

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/faqs.json')
      .then((r) => r.json())
      .then((data) => { setFaqs(data); setLoading(false); })
      .catch(() => { setFaqs([]); setLoading(false); });
  }, []);

  const filtered = faqs.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.keyword.toLowerCase().includes(q) ||
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (faq) => {
    setEditingId(faq.id);
    setForm({ keyword: faq.keyword, question: faq.question, answer: faq.answer });
    setErrors({});
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const validate = () => {
    const e = {};
    if (!form.keyword.trim()) e.keyword = 'Required';
    if (!form.question.trim()) e.question = 'Required';
    if (!form.answer.trim()) e.answer = 'Required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    if (editingId) {
      setFaqs((prev) => prev.map((f) => f.id === editingId ? { ...f, ...form } : f));
    } else {
      const newId = faqs.length > 0 ? Math.max(...faqs.map((f) => f.id)) + 1 : 1;
      setFaqs((prev) => [...prev, { id: newId, ...form }]);
    }
    setModalOpen(false);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const s = {
    badge: (color = '#004a99', bg = '#e6f0ff') => ({
      background: bg, color, fontSize: 11, fontWeight: 700,
      padding: '3px 10px', borderRadius: 4, whiteSpace: 'nowrap',
    }),
    btn: (primary = true) => ({
      background: primary ? '#004a99' : '#fff',
      color: primary ? '#fff' : '#555',
      border: primary ? 'none' : '1px solid #ccc',
      borderRadius: 7, padding: '8px 18px',
      fontSize: 13, cursor: 'pointer', fontWeight: 500,
    }),
    input: (hasError) => ({
      width: '100%', padding: '9px 12px',
      border: `1px solid ${hasError ? '#e53e3e' : '#ccc'}`,
      borderRadius: 7, fontSize: 13, outline: 'none',
      boxSizing: 'border-box',
    }),
  };

  return (
    <div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>FAQ Knowledge Base</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>
            {faqs.length} entries — bot uses this data to answer questions
          </p>
        </div>
        <button onClick={openAdd} style={s.btn(true)}>+ Add FAQ</button>
      </div>

      <input
        type="text"
        placeholder="Search by keyword, question, or answer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px', marginBottom: 16,
          border: '1px solid #ddd', borderRadius: 8,
          fontSize: 13, outline: 'none', boxSizing: 'border-box',
        }}
      />

      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#aaa', fontSize: 14 }}>
            {search ? 'No results for that search.' : 'No FAQs yet. Click "+ Add FAQ" to create one.'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f5f7fa', borderBottom: '1px solid #e0e0e0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontWeight: 600, width: 100 }}>Keyword</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontWeight: 600, width: '28%' }}>Question</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666', fontWeight: 600 }}>Answer</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: '#666', fontWeight: 600, width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((faq, i) => (
                <tr key={faq.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f0f0f0' : 'none', verticalAlign: 'top' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={s.badge()}>{faq.keyword}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#333', fontWeight: 500, lineHeight: 1.5 }}>
                    {faq.question}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#555', lineHeight: 1.6 }}>
                    {expandedId === faq.id ? faq.answer : faq.answer.slice(0, 90) + (faq.answer.length > 90 ? '…' : '')}
                    {faq.answer.length > 90 && (
                      <button
                        onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                        style={{ background: 'none', border: 'none', color: '#004a99', fontSize: 12, cursor: 'pointer', marginLeft: 4, padding: 0 }}
                      >
                        {expandedId === faq.id ? 'less' : 'more'}
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button onClick={() => openEdit(faq)} style={{ color: '#004a99', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, marginRight: 8, fontWeight: 500 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(faq.id)} style={{ color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: 28,
            width: '100%', maxWidth: 460, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            margin: '0 16px',
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
              {editingId ? 'Edit FAQ' : 'Add FAQ'}
            </h3>

            {[
              { field: 'keyword', label: 'Keyword', placeholder: 'e.g. LC', type: 'input' },
              { field: 'question', label: 'Question', placeholder: 'e.g. What is a Letter of Credit?', type: 'input' },
              { field: 'answer', label: 'Answer', placeholder: 'Enter the answer...', type: 'textarea' },
            ].map(({ field, label, placeholder, type }) => (
              <div key={field} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>
                  {label} <span style={{ color: '#e53e3e' }}>*</span>
                </label>
                {type === 'textarea' ? (
                  <textarea
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    style={{ ...s.input(!!errors[field]), resize: 'vertical' }}
                  />
                ) : (
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    style={s.input(!!errors[field])}
                  />
                )}
                {errors[field] && <p style={{ color: '#e53e3e', fontSize: 12, margin: '4px 0 0' }}>{errors[field]}</p>}
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button onClick={() => setModalOpen(false)} style={s.btn(false)}>Cancel</button>
              <button onClick={handleSave} style={s.btn(true)}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;