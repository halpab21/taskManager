import { useState, useMemo, useEffect } from 'react';
import type { Task, Dashboard, Priority } from '../interfaces/interface';
import './Calendar.css';

interface CalendarProps {
    dashboards: Dashboard[];
}

export default function Calendar({ dashboards }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [selectedDashboardId, setSelectedDashboardId] = useState<number | 'all'>('all');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Fetch tasks from every dashboard whenever the dashboard list changes
    useEffect(() => {
        if (dashboards.length === 0) return;
        Promise.all(
            dashboards.map(d =>
                fetch(`http://localhost:8080/dashboard/${d.id}/tasks`)
                    .then(r => r.json())
                    .then((tasks: Task[]) => tasks.map(t => ({ ...t, dashboardId: d.id })))
                    .catch(() => [] as Task[])
            )
        ).then(results => setAllTasks(results.flat()));
    }, [dashboards]);

    const tasks = useMemo(() => {
        if (selectedDashboardId === 'all') return allTasks;
        return allTasks.filter(t => t.dashboardId === selectedDashboardId);
    }, [allTasks, selectedDashboardId]);

    const calendarDays = useMemo(() => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const days: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);
        return days;
    }, [year, month]);

    const getTasksForDay = (day: number | null): Task[] => {
        if (!day) return [];
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return tasks.filter(task => task.deadline === dateStr);
    };

    const isToday = (day: number | null) => {
        if (!day) return false;
        const today = new Date();
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const getPriorityClass = (priority: Priority) => {
        switch (priority) {
            case 'ASAP': return 'priority-asap';
            case 'SOON': return 'priority-soon';
            case 'SOMETIME_IN_FUTURE': return 'priority-sometime';
        }
    };

    const upcomingTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return tasks
            .filter(t => t.deadline && !t.completed && new Date(t.deadline) >= today)
            .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
            .slice(0, 5);
    }, [tasks]);

    const dashboardName = (id: number) => dashboards.find(d => d.id === id)?.name ?? String(id);

    return (
        <div className="calendar-page">
            <header className="calendar-header">
                <div>
                    <h1>Calendar</h1>
                    <p className="subtitle">View your tasks by date</p>
                </div>
                {dashboards.length > 1 && (
                    <select
                        className="calendar-dashboard-filter"
                        value={selectedDashboardId}
                        onChange={e => setSelectedDashboardId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    >
                        <option value="all">All dashboards</option>
                        {dashboards.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                )}
            </header>

            <div className="calendar-layout">
                <div className="calendar-main">
                    <div className="calendar-nav">
                        <button className="nav-btn" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>←</button>
                        <div className="current-month">
                            <h2>{monthNames[month]} {year}</h2>
                            <button className="today-btn" onClick={() => setCurrentDate(new Date())}>Today</button>
                        </div>
                        <button className="nav-btn" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>→</button>
                    </div>

                    <div className="calendar-grid">
                        {daysOfWeek.map(day => (
                            <div key={day} className="calendar-weekday">{day}</div>
                        ))}
                        {calendarDays.map((day, index) => {
                            const dayTasks = getTasksForDay(day);
                            return (
                                <div
                                    key={index}
                                    className={`calendar-day ${day ? '' : 'empty'} ${isToday(day) ? 'today' : ''}`}
                                >
                                    {day && (
                                        <>
                                            <span className="day-number">{day}</span>
                                            <div className="day-tasks">
                                                {dayTasks.slice(0, 3).map(task => (
                                                    <div
                                                        key={task.id}
                                                        className={`day-task ${getPriorityClass(task.priority)} ${task.completed ? 'completed' : ''}`}
                                                        title={`${task.title}${dashboards.length > 1 ? ` · ${dashboardName(task.dashboardId!)}` : ''}`}
                                                    >
                                                        {task.title}
                                                    </div>
                                                ))}
                                                {dayTasks.length > 3 && (
                                                    <div className="more-tasks">+{dayTasks.length - 3} more</div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <aside className="calendar-sidebar">
                    <h3>Upcoming Deadlines</h3>
                    {upcomingTasks.length === 0 ? (
                        <p className="no-upcoming">No upcoming deadlines</p>
                    ) : (
                        <div className="upcoming-list">
                            {upcomingTasks.map(task => (
                                <div key={task.id} className="upcoming-task">
                                    <div className={`upcoming-priority ${getPriorityClass(task.priority)}`} />
                                    <div className="upcoming-content">
                                        <span className="upcoming-title">{task.title}</span>
                                        <span className="upcoming-date">
                                            {new Date(task.deadline!).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                                            {dashboards.length > 1 && (
                                                <span className="upcoming-dashboard"> · {dashboardName(task.dashboardId!)}</span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
