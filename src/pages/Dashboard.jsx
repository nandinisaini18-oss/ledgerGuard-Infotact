import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import { logoutUser } from '../services/user'

function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const navigate = useNavigate()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logoutUser()
      navigate('/')
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitError) {
    return (
      <div className="form-container">
        <div className="form-container__header">
          <h1 className="form-container__title">Error</h1>
        </div>

        <div className="form-container__body">
          <Alert
            variant="error"
            title="Logout Failed"
            message="An error occurred during logout. Please try again."
          />
        </div>

        <div className="form-container__actions">
          <Button variant="secondary" fullWidth onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="form-container">
      <div className="form-container__header">
        <h1 className="form-container__title">Dashboard</h1>
        <p className="form-container__subtitle">Login Successful</p>
      </div>

      <div className="form-container__body">
        <Alert
          variant="success"
          title="Login Successful"
          message="You have been logged in successfully."
        />
      </div>

      <div className="form-container__actions">
        <Button
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
          onClick={handleLogout}
        >
          Logout
        </Button>
        <Link to="/">
          <Button variant="secondary" fullWidth>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
