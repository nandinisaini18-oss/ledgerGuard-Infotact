import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__card">
        <span className="not-found__code">404</span>
        <h1 className="not-found__title">Page not found</h1>
        <p className="not-found__description">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="not-found__actions">
          <Link to="/">
            <Button variant="primary">Go Home</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary">Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
