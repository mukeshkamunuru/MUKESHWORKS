import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, getMe } from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [busy,     setBusy]     = useState(false)
  const { saveUser } = useAuth()
  const navigate     = useNavigate()

  async function handleLogin() {
    if (!username || !password) { setError('Please fill all fields.'); return }
    setError(''); setBusy(true)
    try {
      const { data } = await login({ username, password })
      localStorage.setItem('access',  data.access)
      localStorage.setItem('refresh', data.refresh)
      const me = await getMe()
      saveUser(me.data)
      navigate('/dashboard')
    } catch {
      setError('Wrong username or password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>NW</div>
        <h2 style={styles.title}>Sign In</h2>
        <p style={styles.sub}>NovaWorks ID System</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button style={styles.btn} onClick={handleLogin} disabled={busy}>
          {busy ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={styles.footer}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page:  { minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card:  { background: '#1a1d27', border: '1px solid #2e3347', borderRadius: '14px', padding: '2.5rem 2rem', width: '100%', maxWidth: '400px' },
  logo:  { width: '50px', height: '50px', background: 'linear-gradient(135deg,#4f8ef7,#7c5cfc)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem' },
  title: { color: '#e8eaf0', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.2rem' },
  sub:   { color: '#7b82a0', fontSize: '0.88rem', marginBottom: '1.5rem' },
  error: { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.6rem 0.9rem', marginBottom: '1rem', fontSize: '0.88rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', color: '#7b82a0', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' },
  input: { display: 'block', width: '100%', background: '#22263a', border: '1px solid #2e3347', borderRadius: '8px', padding: '10px 14px', color: '#ffffff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
  btn:   { display: 'block', width: '100%', background: 'linear-gradient(135deg,#4f8ef7,#7c5cfc)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' },
  footer:{ textAlign: 'center', color: '#7b82a0', marginTop: '1.2rem', fontSize: '0.88rem' },
}
