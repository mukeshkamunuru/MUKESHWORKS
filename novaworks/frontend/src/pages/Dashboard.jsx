import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecords, createRecord, deleteRecord } from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()

  const [records,    setRecords]    = useState([])
  const [fullName,   setFullName]   = useState('')
  const [department, setDepartment] = useState('')
  const [year,       setYear]       = useState('')
  const [error,      setError]      = useState('')
  const [generated,  setGenerated]  = useState('')
  const [busy,       setBusy]       = useState(false)
  const [search,     setSearch]     = useState('')
  const [confirmDel, setConfirmDel] = useState(null)

  useEffect(() => {
    getRecords()
      .then(({ data }) => setRecords(data))
      .catch(() => {})
  }, [])

  async function handleGenerate() {
    setError('')
    if (!fullName.trim())            { setError('Full name is required.');           return }
    if (department.trim().length < 3){ setError('Department must be 3+ characters.'); return }
    if (!/^\d{4}$/.test(year))       { setError('Year must be 4 digits.');            return }

    setBusy(true)
    try {
      const { data } = await createRecord({ full_name: fullName, department, year })
      setGenerated(data.joining_id)
      setRecords(prev => [data, ...prev])
      setFullName(''); setDepartment(''); setYear('')
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id) {
    await deleteRecord(id)
    setRecords(prev => prev.filter(r => r.id !== id))
    setConfirmDel(null)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const filtered = records.filter(r =>
    r.full_name.toLowerCase().includes(search.toLowerCase()) ||
    r.joining_id.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e8eaf0', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <div style={{ background: '#1a1d27', borderBottom: '1px solid #2e3347', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#e8eaf0' }}>⚡ NovaWorks</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#7b82a0', fontSize: '0.9rem' }}>👤 {user?.username}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #2e3347', color: '#e8eaf0', borderRadius: '7px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.9rem' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Generate Card */}
        <div style={{ background: '#1a1d27', border: '1px solid #2e3347', borderRadius: '12px', padding: '28px', marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '1.2rem' }}>Generate Joining ID</h2>
          <p style={{ color: '#7b82a0', fontSize: '0.88rem', margin: '0 0 20px' }}>Fill in the details to create a unique employee ID</p>

          {generated && (
            <div style={{ background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ color: '#4f8ef7', fontSize: '0.78rem', fontWeight: 700 }}>GENERATED ID</span>
              <span style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 700, flex: 1 }}>{generated}</span>
              <button onClick={() => navigator.clipboard.writeText(generated)} style={{ background: '#4f8ef7', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '0.85rem' }}>Copy</button>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          {/* Full Name */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', color: '#7b82a0', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Arjun Reddy Kumar"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              style={{ display: 'block', width: '100%', background: '#22263a', border: '1px solid #2e3347', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Department + Year row */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '140px' }}>
              <label style={{ display: 'block', color: '#7b82a0', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Department</label>
              <input
                type="text"
                placeholder="e.g. Engineering"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                style={{ display: 'block', width: '100%', background: '#22263a', border: '1px solid #2e3347', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '140px' }}>
              <label style={{ display: 'block', color: '#7b82a0', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Joining Year</label>
              <input
                type="text"
                placeholder="e.g. 2026"
                value={year}
                onChange={e => setYear(e.target.value)}
                maxLength={4}
                style={{ display: 'block', width: '100%', background: '#22263a', border: '1px solid #2e3347', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={busy}
            style={{ display: 'block', width: '100%', background: 'linear-gradient(135deg,#4f8ef7,#7c5cfc)', color: '#fff', border: 'none', borderRadius: '8px', padding: '13px', fontSize: '1rem', fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.6 : 1 }}
          >
            {busy ? 'Generating...' : '⚡ Generate ID'}
          </button>
        </div>

        {/* Records */}
        <div style={{ background: '#1a1d27', border: '1px solid #2e3347', borderRadius: '12px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
              All Joining IDs
              <span style={{ background: '#22263a', color: '#7b82a0', borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', marginLeft: '8px' }}>{records.length}</span>
            </h2>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: '#22263a', border: '1px solid #2e3347', borderRadius: '8px', padding: '8px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '220px', boxSizing: 'border-box' }}
            />
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#7b82a0', padding: '40px' }}>
              {search ? 'No results found.' : 'No records yet. Generate your first ID above!'}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#22263a' }}>
                    {['#','Full Name','Department','Year','Joining ID','By','Date',''].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#7b82a0', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} style={{ borderTop: '1px solid #2e3347' }}>
                      <td style={{ padding: '12px' }}>{i + 1}</td>
                      <td style={{ padding: '12px' }}>{r.full_name}</td>
                      <td style={{ padding: '12px' }}><span style={{ background: '#22263a', borderRadius: '5px', padding: '2px 8px', fontSize: '0.8rem' }}>{r.department}</span></td>
                      <td style={{ padding: '12px' }}>{r.year}</td>
                      <td style={{ padding: '12px' }}><code style={{ color: '#4f8ef7', background: 'rgba(79,142,247,0.1)', padding: '2px 8px', borderRadius: '5px', fontFamily: 'monospace' }}>{r.joining_id}</code></td>
                      <td style={{ padding: '12px' }}>{r.created_by_username}</td>
                      <td style={{ padding: '12px' }}>{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '12px' }}>
                        {confirmDel === r.id ? (
                          <span style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleDelete(r.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '5px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>Yes</button>
                            <button onClick={() => setConfirmDel(null)} style={{ background: '#22263a', color: '#e8eaf0', border: 'none', borderRadius: '5px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>No</button>
                          </span>
                        ) : (
                          <button onClick={() => setConfirmDel(r.id)} style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
