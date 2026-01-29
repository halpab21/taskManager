import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1>📋 TaskManager</h1>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">🏠</span>
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/calendar" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">📅</span>
                    <span>Calendar</span>
                </NavLink>
            </nav>
            <div className="sidebar-footer">
                <p>© 2026 TaskManager</p>
            </div>
        </aside>
    );
}

