import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logoutUser } from '../../services/user'
import Logo from '../ui/Logo'

export default function DashboardLayout() {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    try {
      await logoutUser()
    } catch {
      // API call failed — log out locally anyway
    }
    setUser(null)
    navigate('/')
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="dashboard-header__inner">
          <Logo />
          <nav className="dashboard-header__nav" aria-label="Dashboard navigation">
            <Link
              to="/dashboard"
              className={`dashboard-header__nav-link ${location.pathname === '/dashboard' ? 'dashboard-header__nav-link--active' : ''}`}
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className={`dashboard-header__nav-link ${location.pathname.startsWith('/transactions') ? 'dashboard-header__nav-link--active' : ''}`}
            >
              Transactions
            </Link>
            <Link
              to="/analytics"
              className={`dashboard-header__nav-link ${location.pathname === '/analytics' ? 'dashboard-header__nav-link--active' : ''}`}
            >
              Analytics
            </Link>
            <Link
              to="/company"
              className={`dashboard-header__nav-link ${location.pathname === '/company' ? 'dashboard-header__nav-link--active' : ''}`}
            >
              Company
            </Link>
          </nav>
          <button className="dashboard-header__logout" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}