import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context'
import { logoutUser } from '../services/user'
import Logo from '../components/ui/Logo'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const userFields = [
  { label: 'Role', key: 'role' },
  { label: 'Company ID', key: 'companyId' },
]

export default function AuthenticatedHome() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logoutUser()
      setUser(null)
      navigate('/')
    } catch {
      // handled by API interceptor
    }
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="dashboard-header__inner">
          <Logo />
          <h1 className="dashboard-header__title">Home</h1>
          <div className="dashboard-header__user">
            <span className="dashboard-header__name">{user?.fullname}</span>
            <button className="dashboard-header__logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="form-container">
          <div className="form-container__header">
            <h1 className="form-container__title">Welcome back, {user?.fullname}</h1>
            <p className="form-container__subtitle">
              Manage your organization&apos;s financial operations from your dashboard.
            </p>
          </div>
          <div className="form-container__body">
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {userFields.map(({ label, key }) => (
                  <div key={key}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>
                      {label}
                    </p>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--color-gray-900)' }}>
                      {user?.[key] || '\u2014'}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="form-container__actions">
              <Button variant="primary" fullWidth onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
              <Button variant="secondary" fullWidth onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
