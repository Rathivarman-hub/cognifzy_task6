import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const features = [
  { icon: 'bi-shield-check', title: 'JWT Authentication', desc: 'Secure token-based auth with httpOnly cookies and refresh token rotation.' },
  { icon: 'bi-person-lock', title: 'Role-Based Access', desc: 'Granular user and admin roles with protected route enforcement.' },
  { icon: 'bi-moon-stars', title: 'Dark / Light Mode', desc: 'System-aware theme toggle with smooth transitions and persisted preference.' },
  { icon: 'bi-envelope-check', title: 'Email Verification', desc: 'Confirm accounts via email with time-limited secure tokens.' },
  { icon: 'bi-key', title: 'Password Reset', desc: 'Secure forgot-password flow with hashed reset tokens and expiry.' },
  { icon: 'bi-activity', title: 'Activity Tracking', desc: 'Login history and account activity log for audit and transparency.' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="page-home">
      {/* Hero */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <div className="hero-badge mb-4">
                <i className="bi bi-lightning-charge-fill me-2"></i>
                MERN Stack · MVC Architecture · Production Ready
              </div>
              <h1 className="hero-title">
                Authentication,<br />
                <span className="hero-title-accent">done right.</span>
              </h1>
              <p className="hero-subtitle">
                A full-stack authentication boilerplate built with React 19, Node.js, Express,
                and MongoDB — featuring JWT, role-based access control, dark mode, and more.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
                {user ? (
                  <Link to="/dashboard" className="btn btn-primary btn-lg px-5">
                    <i className="bi bi-speedometer2 me-2"></i>Open Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg px-5">
                      <i className="bi bi-rocket-takeoff me-2"></i>Get Started
                    </Link>
                    <Link to="/login" className="btn btn-outline-primary btn-lg px-5">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Everything you need</h2>
            <p className="section-subtitle">Production-grade features out of the box</p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-sm-6 col-lg-4">
                <div className="feature-card h-100">
                  <div className="feature-icon mb-3">
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <h5 className="feature-title">{f.title}</h5>
                  <p className="feature-desc mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="stack-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Built with modern tools</h2>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {['React 19', 'Vite', 'Bootstrap 5', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'bcrypt', 'Multer'].map((tech) => (
              <span key={tech} className="tech-badge">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <div className="container text-center">
            <h2 className="cta-title">Ready to build?</h2>
            <p className="cta-subtitle">Clone, configure your .env, and go.</p>
            <Link to="/register" className="btn btn-primary btn-lg px-5">
              Create your account <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
