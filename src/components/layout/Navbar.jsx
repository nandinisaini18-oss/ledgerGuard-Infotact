import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../ui/Logo'

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        <Logo />
        <button
          className="navbar__mobile-toggle"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="navbar-menu"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
        <div
          id="navbar-menu"
          className={`navbar__links ${open ? 'navbar__links--open' : ''}`}
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/register-company"
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
            onClick={() => setOpen(false)}
          >
            Register Company
          </NavLink>
          <NavLink
            to="/register-user"
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
            onClick={() => setOpen(false)}
          >
            Register User
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
