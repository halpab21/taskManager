import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import type { Dashboard as DashboardType } from './interfaces/interface.ts';
import { getMyDashboardIds, saveMyDashboardId } from './utils/dashboardStorage';
import Sidebar from './components/Sidebar';
import Calendar from './pages/Calendar';
import DashboardPage from './pages/DashboardPage';

function applyStoredTheme() {
    const vars: Record<string, string> = {
        'theme-bg': '--bg-primary',
        'theme-accent': '--accent-color',
        'theme-surface': '--bg-secondary',
        'theme-text': '--text-primary',
    };
    Object.entries(vars).forEach(([key, cssVar]) => {
        const stored = localStorage.getItem(key);
        if (stored) document.documentElement.style.setProperty(cssVar, stored);
    });
}

export default function App() {
    const [dashboards, setDashboards] = useState<DashboardType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        applyStoredTheme();

        const init = async () => {
            try {
                const all: DashboardType[] = await fetch('http://localhost:8080/dashboards').then(r => r.json());
                const myIds = getMyDashboardIds();
                let mine = myIds.length ? all.filter(d => myIds.includes(d.id)) : [];

                // First-time user: auto-create a Personal dashboard
                if (mine.length === 0) {
                    const res = await fetch('http://localhost:8080/dashboard', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: 'Personal', isGroup: false }),
                    });
                    if (res.ok) {
                        const created: DashboardType = await res.json();
                        saveMyDashboardId(created.id);
                        mine = [created];
                    }
                }

                setDashboards(mine);
            } catch {
                // backend not reachable
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    return (
        <Router>
            <div className="app-container">
                <Sidebar dashboards={dashboards} setDashboards={setDashboards} />
                <main className="main-content">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                loading ? null : dashboards.length > 0
                                    ? <Navigate to={`/dashboard/${dashboards[0].id}`} replace />
                                    : <div style={{ padding: 40, color: 'var(--text-primary)' }}>Could not reach the server.</div>
                            }
                        />
                        <Route path="/calendar" element={<Calendar dashboards={dashboards} />} />
                        <Route path="/dashboard/:id" element={<DashboardPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
