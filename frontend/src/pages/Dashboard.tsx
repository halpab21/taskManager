import { useState } from 'react';
import type { Task, Priority, CreatePost } from '../interfaces/interface';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import './Dashboard.css';

interface DashboardProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function Dashboard({ tasks, setTasks }: DashboardProps) {
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newPriority, setNewPriority] = useState<Priority>('SOMETIME_IN_FUTURE');
    const [newDeadline, setNewDeadline] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    const toggleTask = async (id: number) => {
        // Optimistic update first
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );

        try {
            const res = await fetch(`http://localhost:8080/task/${id}/toggle`, {
                method: 'PATCH',
            });
            if (res.ok) {
                const updatedTask = await res.json();
                // Sync with server response
                setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
            }
        } catch {
            // Already updated optimistically, no need to do anything
        }
    };

    const deleteTask = async (id: number) => {
        // Optimistic delete
        setTasks((prev) => prev.filter((t) => t.id !== id));

        try {
            await fetch(`http://localhost:8080/task/${id}`, {
                method: 'DELETE',
            });
        } catch {
            // If delete fails, we could restore the task, but for now just log
            console.error('Failed to delete task on server');
        }
    };

    const addTask = async () => {
        if (!newTitle.trim()) return;

        const data: CreatePost = {
            title: newTitle,
            description: newDescription,
            priority: newPriority,
            deadline: newDeadline || null,
        };

        try {
            const res = await fetch('http://localhost:8080/task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const createdTask = await res.json();
                setTasks((prev) => [...prev, createdTask]);
            }
        } catch (err) {
            console.error('Error creating task:', err);
        }

        resetForm();
    };

    const resetForm = () => {
        setNewTitle('');
        setNewDescription('');
        setNewPriority('SOMETIME_IN_FUTURE');
        setNewDeadline('');
        setShowModal(false);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const priorityOrder = { ASAP: 0, SOON: 1, SOMETIME_IN_FUTURE: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const stats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.completed).length,
        active: tasks.filter((t) => !t.completed).length,
    };

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p className="subtitle">Manage your tasks efficiently</p>
                </div>
                <button className="add-task-btn" data-testid="add-task-btn" onClick={() => setShowModal(true)}>
                    <span>+</span> New Task
                </button>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Total Tasks</span>
                </div>
                <div className="stat-card stat-active">
                    <span className="stat-number">{stats.active}</span>
                    <span className="stat-label">Active</span>
                </div>
                <div className="stat-card stat-completed">
                    <span className="stat-number">{stats.completed}</span>
                    <span className="stat-label">Completed</span>
                </div>
            </div>

            <div className="filter-bar">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => setFilter('active')}
                >
                    Active
                </button>
                <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
            </div>

            <div className="tasks-list">
                {sortedTasks.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📋</span>
                        <p>No tasks found</p>
                        <button className="add-task-btn-small" onClick={() => setShowModal(true)}>
                            Create your first task
                        </button>
                    </div>
                ) : (
                    sortedTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                        />
                    ))
                )}
            </div>

            <TaskModal
                isOpen={showModal}
                onClose={resetForm}
                onSubmit={addTask}
                title={newTitle}
                setTitle={setNewTitle}
                description={newDescription}
                setDescription={setNewDescription}
                priority={newPriority}
                setPriority={setNewPriority}
                deadline={newDeadline}
                setDeadline={setNewDeadline}
            />
        </div>
    );
}
