import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Secure Infrastructure',
    description: 'Enterprise-grade security with encrypted data storage and compliant infrastructure for your financial operations.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Team Management',
    description: 'Efficiently manage users and roles across your organization with fine-grained access controls.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: 'Subscription Plans',
    description: 'Flexible plans that scale with your organization. Start small and upgrade as your needs grow.',
  },
]

function Home() {
  return (
    <div className="home">
      <section className="home__hero">
        <div className="home__hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Enterprise financial management
        </div>
        <h1 className="home__hero-title">
          Secure financial operations for <span>modern enterprises</span>
        </h1>
        <p className="home__hero-subtitle">
          LedgerGuard provides a secure, scalable platform for managing your
          organization&apos;s financial data, users, and compliance requirements.
        </p>
        <div className="home__hero-actions">
          <Link to="/register-company">
            <Button variant="primary" size="lg">
              Register Company
            </Button>
          </Link>
          <Link to="/register-user">
            <Button variant="secondary" size="lg">
              Create Account
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="lg">
              Login
            </Button>
          </Link>
        </div>
      </section>

      <section className="home__features" aria-labelledby="features-title">
        <div className="home__features-header">
          <h2 id="features-title" className="home__features-title">
            Everything you need to get started
          </h2>
          <p className="home__features-subtitle">
            A complete foundation for your financial management platform.
          </p>
        </div>
        <div className="home__features-grid">
          {features.map((feature) => (
            <article key={feature.title} className="home__feature-card">
              <div className="home__feature-icon" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="home__feature-title">{feature.title}</h3>
              <p className="home__feature-description">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="home__cta">
        <div className="home__cta-card">
          <h2 className="home__cta-title">Ready to get started?</h2>
          <p className="home__cta-subtitle">
            Register your company today and take control of your financial
            operations.
          </p>
          <Link to="/register-company">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
