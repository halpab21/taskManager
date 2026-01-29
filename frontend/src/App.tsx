import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import mockdata from './mockdata/mockdata.ts';
import type { Task } from './interfaces/interface.ts';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';

export default function App() {
    const [tasks, setTasks] = useState<Task[]>(mockdata);

    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard tasks={tasks} setTasks={setTasks} />} />
                        <Route path="/calendar" element={<Calendar tasks={tasks} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
