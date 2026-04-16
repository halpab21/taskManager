import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import type { Task, Dashboard as DashboardType } from './interfaces/interface.ts';
import { getMyDashboardIds } from './utils/dashboardStorage';
import Sidebar from './components/Sidebar';
import DashboardView from './pages/Dashboard';
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
    const [tasks, setTasks] = useState<Task[]>([]);
    const [dashboards, setDashboards] = useState<DashboardType[]>([]);

    useEffect(() => {
        applyStoredTheme();
        fetch('http://localhost:8080/')
            .then(r => r.json())
            .then(setTasks)
            .catch(() => {});

        fetch('http://localhost:8080/dashboards')
            .then(r => r.json())
            .then((all: DashboardType[]) => {
                const myIds = getMyDashboardIds();
                // Only show dashboards this browser created or joined
                setDashboards(myIds.length ? all.filter(d => myIds.includes(d.id)) : []);
            })
            .catch(() => {});
    }, []);

    return (
        <Router>
            <div className="app-container">
                <Sidebar dashboards={dashboards} setDashboards={setDashboards} />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<DashboardView tasks={tasks} setTasks={setTasks} />} />
                        <Route path="/calendar" element={<Calendar tasks={tasks} />} />
                        <Route path="/dashboard/:id" element={<DashboardPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
