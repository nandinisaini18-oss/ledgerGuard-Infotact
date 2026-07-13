"use client"

import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logoutUser } from '../../services/user'
import Logo from '../ui/Logo'

export default function DashboardLayout() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logoutUser()
      setUser(null)
      navigate('/')
    } catch {
      // Error handled by logout API
    }
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="dashboard-header__inner">
          <Logo />
          <h1 className="dashboard-header__title">Dashboard</h1>
          <div className="dashboard-header__user">
            <span className="dashboard-header__name">{user?.fullname}</span>
            <button className="dashboard-header__logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}