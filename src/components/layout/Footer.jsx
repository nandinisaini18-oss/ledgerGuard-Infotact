import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <Logo />
        <nav className="footer__links" aria-label="Footer navigation">
          <Link to="/" className="footer__link">Home</Link>
          <Link to="/register-company" className="footer__link">Register Company</Link>
          <Link to="/register-user" className="footer__link">Register User</Link>
        </nav>
        <p className="footer__text">
          &copy; {year} LedgerGuard. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
