import type { Task, Priority } from '../interfaces/interface';
import './TaskCard.css';

interface TaskCardProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete?: (id: number) => void;
    onEdit?: (task: Task) => void;
}

export default function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
    const getPriorityClass = (priority: Priority) => {
        switch (priority) {
            case 'ASAP': return 'priority-asap';
            case 'SOON': return 'priority-soon';
            case 'SOMETIME_IN_FUTURE': return 'priority-sometime';
        }
    };

    const getPriorityLabel = (priority: Priority) => {
        switch (priority) {
            case 'ASAP': return 'ASAP';
            case 'SOON': return 'Soon';
            case 'SOMETIME_IN_FUTURE': return 'Sometime';
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className={`task-card ${task.completed ? 'task-completed' : ''}`} data-testid="task-card">
            <button
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                data-testid="task-checkbox"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle(task.id);
                }}
                aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
                {task.completed && <span className="checkmark">✓</span>}
            </button>

            <div className="task-body">
                <div className="task-header">
                    <h3 className="task-title" data-testid="task-title">{task.title}</h3>
                    <span className={`priority-badge ${getPriorityClass(task.priority)}`} data-testid="task-priority">
                        {getPriorityLabel(task.priority)}
                    </span>
                </div>
                <p className="task-description" data-testid="task-description">{task.description}</p>
                <div className="task-time" data-testid="task-time">
                    {task.startDate && (
                        <span>{formatDate(task.startDate)}  -</span>
                    )}
                    {task.deadline ? (
                        <span>{formatDate(task.deadline)}</span>
                    ) : (
                        <span>∞</span>
                    )}
                </div>
            </div>

            <div className="task-actions">
                {onEdit && (
                    <button
                        className="edit-btn"
                        data-testid="edit-task-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                        }}
                        aria-label="Edit task"
                    >✏️</button>
                )}
                {onDelete && (
                    <button
                        className="delete-btn"
                        data-testid="delete-task-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                        }}
                        aria-label="Delete task"
                    >🗑️</button>
                )}
            </div>
        </div>
    );
}
