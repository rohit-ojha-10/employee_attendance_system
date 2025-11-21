import { useContext } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../index.css';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h3>Unified System</h3>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item">Dashboard</Link>
                    <Link to="/attendance" className="nav-item">Attendance</Link>
                    <Link to="/leaves" className="nav-item">Leaves</Link>
                    <Link to="/tasks" className="nav-item">Tasks</Link>
                    {user && user.role === 'admin' && (
                        <Link to="/admin" className="nav-item">Admin Panel</Link>
                    )}
                </nav>
                <div className="sidebar-footer">
                    <div className="user-info">
                        <p>{user?.name}</p>
                        <small>{user?.role}</small>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </aside>
            <main className="main-content">
                <header className="top-bar">
                    <h2>Welcome, {user?.name}</h2>
                </header>
                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
