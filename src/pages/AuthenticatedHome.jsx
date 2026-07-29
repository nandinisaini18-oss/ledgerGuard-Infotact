import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context'
import { logoutUser } from '../services/user'
import Logo from '../components/ui/Logo'
import Button from '../components/ui/Button'

export default function AuthenticatedHome() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logoutUser()
    } catch {
      // API call failed — log out locally anyway
    }
    setUser(null)
    navigate('/')
  }

  const displayName = user?.fullname || 'there'
  const firstName = displayName.split(' ')[0]

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="dashboard-header__inner">
          <Logo />
          <div className="dashboard-header__user">
            <button className="dashboard-header__logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="auth-home">
          <div className="auth-home__greeting">
            <p className="auth-home__eyebrow">Welcome back</p>
            <h1 className="auth-home__title">
              Hello, {firstName}
            </h1>
            <p className="auth-home__subtitle">
              Ready to continue managing your financial operations.
              Head to your dashboard to get started.
            </p>
          </div>

          <div className="auth-home__card">
            <div className="auth-home__card-header">
              <h2 className="auth-home__card-title">Your Account</h2>
            </div>
            <div className="auth-home__card-body">
              <div className="auth-home__info-row">
                <span className="auth-home__info-label">Full Name</span>
                <span className="auth-home__info-value">{user?.fullname || '\u2014'}</span>
              </div>
              <div className="auth-home__info-row">
                <span className="auth-home__info-label">Email</span>
                <span className="auth-home__info-value">{user?.email || '\u2014'}</span>
              </div>
              <div className="auth-home__info-row">
                <span className="auth-home__info-label">Role</span>
                <span className="auth-home__info-value">
                  <span className="auth-home__badge">{user?.role || '\u2014'}</span>
                </span>
              </div>
              <div className="auth-home__info-row">
                <span className="auth-home__info-label">Company ID</span>
                <span className="auth-home__info-value auth-home__info-value--mono">
                  {user?.companyId || '\u2014'}
                </span>
              </div>
            </div>
          </div>

          <div className="auth-home__actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
