import { useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Home from '../pages/Home'
import CompanyRegistration from '../pages/CompanyRegistration'
import UserRegistration from '../pages/UserRegistration'

function AppRoutes() {
  const mainRef = useRef(null)

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main
        id="main-content"
        ref={mainRef}
        className="main-content"
        tabIndex={-1}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register-company" element={<CompanyRegistration />} />
          <Route path="/register-user" element={<UserRegistration />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default AppRoutes
