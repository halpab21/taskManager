import type { Priority } from '../interfaces/interface';
import './TaskModal.css';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    priority: Priority;
    setPriority: (value: Priority) => void;
    deadline: string;
    setDeadline: (value: string) => void;
}

export default function TaskModal({
    isOpen,
    onClose,
    onSubmit,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    deadline,
    setDeadline
}: TaskModalProps) {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="modal-overlay" data-testid="modal-overlay" onClick={onClose}>
            <div className="modal-container" data-testid="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Task</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            data-testid="task-title-input"
                            type="text"
                            placeholder="Enter task title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            data-testid="task-description-input"
                            placeholder="Enter task description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                data-testid="task-priority-select"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as Priority)}
                            >
                                <option value="ASAP">🔴 ASAP</option>
                                <option value="SOON">🟡 Soon</option>
                                <option value="SOMETIME_IN_FUTURE">🟢 Sometime</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="deadline">Deadline</label>
                            <input
                                id="deadline"
                                data-testid="task-deadline-input"
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" data-testid="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" data-testid="submit-task-btn">
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

