import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { Dashboard } from '../interfaces/interface';
import { saveMyDashboardId, removeMyDashboardId } from '../utils/dashboardStorage';
import './Sidebar.css';

interface SidebarProps {
    dashboards: Dashboard[];
    setDashboards: React.Dispatch<React.SetStateAction<Dashboard[]>>;
}

export default function Sidebar({ dashboards, setDashboards }: SidebarProps) {
    const [showNameInput, setShowNameInput] = useState(false);
    const [newDashboardName, setNewDashboardName] = useState('');
    const [isGroup, setIsGroup] = useState(false);
    const [createError, setCreateError] = useState('');
    const [showJoinInput, setShowJoinInput] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joinError, setJoinError] = useState('');
    const [themeOpen, setThemeOpen] = useState(false);
    const [colors, setColors] = useState({
        bg: localStorage.getItem('theme-bg') || '#0f0a19',
        accent: localStorage.getItem('theme-accent') || '#7c3aed',
        surface: localStorage.getItem('theme-surface') || '#1a1025',
        text: localStorage.getItem('theme-text') || '#e9e4f0',
    });
    const navigate = useNavigate();

    const applyColor = (key: string, value: string) => {
        const varMap: Record<string, string> = {
            bg: '--bg-primary',
            accent: '--accent-color',
            surface: '--bg-secondary',
            text: '--text-primary',
        };
        document.documentElement.style.setProperty(varMap[key], value);
        localStorage.setItem(`theme-${key}`, value);
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const resetTheme = () => {
        const defaults = { bg: '#0f0a19', accent: '#7c3aed', surface: '#1a1025', text: '#e9e4f0' };
        Object.entries(defaults).forEach(([k, v]) => applyColor(k, v));
    };

    const createDashboard = async () => {
        const name = newDashboardName.trim();
        if (!name) return;
        setCreateError('');
        try {
            const res = await fetch('http://localhost:8080/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, isGroup }),
            });
            if (res.ok) {
                const created: Dashboard = await res.json();
                saveMyDashboardId(created.id);
                setDashboards(prev => [...prev, created]);
                setNewDashboardName('');
                setIsGroup(false);
                setShowNameInput(false);
                navigate(`/dashboard/${created.id}`);
            } else {
                setCreateError('Failed to create dashboard');
            }
        } catch {
            setCreateError('Could not reach server');
        }
    };

    const deleteDashboard = async (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await fetch(`http://localhost:8080/dashboard/${id}`, { method: 'DELETE' });
        removeMyDashboardId(id);
        setDashboards(prev => prev.filter(d => d.id !== id));
    };

    const joinDashboard = async () => {
        const code = joinCode.trim().toUpperCase();
        if (!code) return;
        const res = await fetch('http://localhost:8080/dashboard/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shareCode: code }),
        });
        if (res.ok) {
            const joined: Dashboard = await res.json();
            saveMyDashboardId(joined.id);
            setDashboards(prev => prev.some(d => d.id === joined.id) ? prev : [...prev, joined]);
            setJoinCode('');
            setJoinError('');
            setShowJoinInput(false);
            navigate(`/dashboard/${joined.id}`);
        } else {
            setJoinError('Invalid share code');
        }
    };

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1>📋 TaskManager</h1>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        <span className="nav-icon">🏠</span>
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/calendar" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        <span className="nav-icon">📅</span>
                        <span>Calendar</span>
                    </NavLink>

                    <div className="sidebar-section-label">
                        <span>My Dashboards</span>
                        <button
                            className="add-dashboard-btn"
                            data-testid="add-dashboard-btn"
                            onClick={() => setShowNameInput(v => !v)}
                            title="New dashboard"
                        >+</button>
                    </div>

                    {showNameInput && (
                        <div className="dashboard-create-form">
                            <input
                                className="dashboard-name-input"
                                data-testid="dashboard-name-input"
                                placeholder="Dashboard name..."
                                value={newDashboardName}
                                onChange={e => setNewDashboardName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && createDashboard()}
                                autoFocus
                            />
                            <label className="group-toggle">
                                <input
                                    type="checkbox"
                                    data-testid="group-dashboard-toggle"
                                    checked={isGroup}
                                    onChange={e => setIsGroup(e.target.checked)}
                                />
                                Group dashboard
                            </label>
                            {createError && <span className="join-error">{createError}</span>}
                            <button className="btn-create-dashboard" onClick={createDashboard}>Create</button>
                        </div>
                    )}

                    {dashboards.map(d => (
                        <NavLink
                            key={d.id}
                            to={`/dashboard/${d.id}`}
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            data-testid="dashboard-list-item"
                        >
                            <span className="nav-icon">{d.isGroup ? '👥' : '📁'}</span>
                            <span style={{ flex: 1 }}>{d.name}</span>
                            {d.isGroup && <span className="group-badge" data-testid="group-badge">Group</span>}
                            <button
                                className="remove-dashboard-btn"
                                onClick={(e) => deleteDashboard(d.id, e)}
                                title="Delete dashboard"
                            >✕</button>
                        </NavLink>
                    ))}

                    <button
                        className="nav-link join-group-btn"
                        data-testid="join-group-btn"
                        onClick={() => setShowJoinInput(v => !v)}
                    >
                        <span className="nav-icon">🔗</span>
                        <span>Join group</span>
                    </button>

                    {showJoinInput && (
                        <div className="dashboard-create-form">
                            <input
                                className="dashboard-name-input"
                                data-testid="join-code-input"
                                placeholder="Enter share code..."
                                value={joinCode}
                                onChange={e => { setJoinCode(e.target.value); setJoinError(''); }}
                                onKeyDown={e => e.key === 'Enter' && joinDashboard()}
                                autoFocus
                            />
                            {joinError && <span className="join-error">{joinError}</span>}
                            <button className="btn-create-dashboard" onClick={joinDashboard}>Join</button>
                        </div>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <button
                        className="theme-btn"
                        data-testid="open-theme-btn"
                        onClick={() => setThemeOpen(v => !v)}
                    >🎨 Theme</button>
                    <p>© 2026 TaskManager</p>
                </div>
            </aside>

            {themeOpen && (
                <div className="theme-panel" data-testid="theme-panel">
                    <div className="theme-panel-header">
                        <h3>Theme</h3>
                        <button onClick={() => setThemeOpen(false)}>✕</button>
                    </div>
                    <div className="theme-panel-body">
                        <label>
                            Background
                            <input type="color" data-testid="color-picker-bg" value={colors.bg}
                                onChange={e => applyColor('bg', e.target.value)} />
                        </label>
                        <label>
                            Accent
                            <input type="color" data-testid="color-picker-accent" value={colors.accent}
                                onChange={e => applyColor('accent', e.target.value)} />
                        </label>
                        <label>
                            Surface
                            <input type="color" data-testid="color-picker-surface" value={colors.surface}
                                onChange={e => applyColor('surface', e.target.value)} />
                        </label>
                        <label>
                            Text
                            <input type="color" data-testid="color-picker-text" value={colors.text}
                                onChange={e => applyColor('text', e.target.value)} />
                        </label>
                        <button
                            className="btn-reset-theme"
                            data-testid="reset-theme-btn"
                            onClick={resetTheme}
                        >Reset to default</button>
                    </div>
                </div>
            )}
        </>
    );
}
