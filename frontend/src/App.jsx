import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-info">
                <h3>Raja Rajeswari Developers</h3>
                <p>© 2026 All Rights Reserved</p>
              </div>
              <div className="footer-contact">
                <p>Proprietor: <strong>Y Lokeswararao</strong></p>
                <div className="footer-links">
                  <a href="tel:+919121999969">📞 +91 9121999969</a>
                  <a href="tel:+919097999969">📞 +91 9097999969</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
