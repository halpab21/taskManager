import { useState, useMemo } from 'react';
import type { Task, Priority } from '../interfaces/interface';
import './Calendar.css';

interface CalendarProps {
    tasks: Task[];
}

export default function Calendar({ tasks }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const calendarDays = useMemo(() => {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days: (number | null)[] = [];

        // Add empty slots for days before the first day of month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    }, [year, month]);

    const getTasksForDay = (day: number | null): Task[] => {
        if (!day) return [];
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return tasks.filter((task) => task.deadline === dateStr);
    };

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
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
            .filter((task) => {
                if (!task.deadline || task.completed) return false;
                const deadline = new Date(task.deadline);
                return deadline >= today;
            })
            .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
            .slice(0, 5);
    }, [tasks]);

    return (
        <div className="calendar-page">
            <header className="calendar-header">
                <div>
                    <h1>Calendar</h1>
                    <p className="subtitle">View your tasks by date</p>
                </div>
            </header>

            <div className="calendar-layout">
                <div className="calendar-main">
                    <div className="calendar-nav">
                        <button className="nav-btn" onClick={prevMonth}>←</button>
                        <div className="current-month">
                            <h2>{monthNames[month]} {year}</h2>
                            <button className="today-btn" onClick={goToToday}>Today</button>
                        </div>
                        <button className="nav-btn" onClick={nextMonth}>→</button>
                    </div>

                    <div className="calendar-grid">
                        {daysOfWeek.map((day) => (
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
                                                {dayTasks.slice(0, 3).map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className={`day-task ${getPriorityClass(task.priority)} ${task.completed ? 'completed' : ''}`}
                                                        title={task.title}
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
                            {upcomingTasks.map((task) => (
                                <div key={task.id} className="upcoming-task">
                                    <div className={`upcoming-priority ${getPriorityClass(task.priority)}`} />
                                    <div className="upcoming-content">
                                        <span className="upcoming-title">{task.title}</span>
                                        <span className="upcoming-date">
                                            {new Date(task.deadline!).toLocaleDateString('de-DE', {
                                                day: '2-digit',
                                                month: 'short'
                                            })}
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

