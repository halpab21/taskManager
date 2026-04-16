import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import type { Task, Dashboard } from '../interfaces/interface';
import DashboardView from './Dashboard';
import './Dashboard.css';

export default function DashboardPage() {
    const { id } = useParams<{ id: string }>();
    const dashboardId = Number(id);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [dashboard, setDashboard] = useState<Dashboard | null>(null);
    const [shareCodeVisible, setShareCodeVisible] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchTasks = () => {
        fetch(`http://localhost:8080/dashboard/${dashboardId}/tasks`)
            .then(r => r.json())
            .then(setTasks)
            .catch(() => {});
    };

    useEffect(() => {
        fetch(`http://localhost:8080/dashboards`)
            .then(r => r.json())
            .then((list: Dashboard[]) => {
                const found = list.find(d => d.id === dashboardId) ?? null;
                setDashboard(found);
            })
            .catch(() => {});

        fetchTasks();
    }, [dashboardId]);

    // Poll every 5s for group dashboards
    useEffect(() => {
        if (dashboard?.isGroup) {
            intervalRef.current = setInterval(fetchTasks, 5000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [dashboard?.isGroup, dashboardId]);

    return (
        <div>
            {dashboard && (
                <div className="named-dashboard-banner">
                    <span>{dashboard.isGroup ? '👥' : '📁'} {dashboard.name}</span>
                    {dashboard.isGroup && dashboard.shareCode && (
                        <div className="share-code-section">
                            <button
                                className="share-code-toggle"
                                data-testid="show-share-code-btn"
                                onClick={() => setShareCodeVisible(v => !v)}
                            >
                                {shareCodeVisible ? 'Hide code' : 'Show share code'}
                            </button>
                            {shareCodeVisible && (
                                <span className="share-code" data-testid="share-code-display">
                                    {dashboard.shareCode}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}
            <DashboardView tasks={tasks} setTasks={setTasks} dashboardId={dashboardId} />
        </div>
    );
}
