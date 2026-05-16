import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <Link to="/" className="navbar-logo">
        Raja Rajeswari Developers
      </Link>
      <div>
        {token ? (
          <>
            <Link to="/admin/dashboard" style={{ marginRight: '20px', color: 'var(--text-muted)' }}>Dashboard</Link>
            <button onClick={handleLogout} className="btn-danger" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Logout</button>
          </>
        ) : (
          <Link to="/admin/login" className="btn-secondary">Admin Access</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
