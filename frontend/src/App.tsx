import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import type { Task, Dashboard as DashboardType } from './interfaces/interface.ts';
import Sidebar from './components/Sidebar';
import DashboardView from './pages/Dashboard';
import Calendar from './pages/Calendar';
import DashboardPage from './pages/DashboardPage';

export default function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [dashboards, setDashboards] = useState<DashboardType[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/')
            .then(r => r.json())
            .then(setTasks)
            .catch(() => {});

        fetch('http://localhost:8080/dashboards')
            .then(r => r.json())
            .then(setDashboards)
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
