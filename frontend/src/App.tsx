import {useState} from "react";
import "./App.css";
import mockdata from "./mockdata/mockdata.ts";
import type {CreatePost} from "./interfaces/interface.ts";

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

export default function App() {
    const [tasks, setTasks] = useState<Task[]>(mockdata);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");


    const toggleTask = (id: number) => {
        setTasks((prev) => {
            return prev.map((t) =>
                t.id === id ? {...t, completed: !t.completed} : t
            );
        });
    };

    const addTask = async () => {
        if (!newTitle.trim()) return;

        const data: CreatePost = {
            title: newTitle,
            description: newDescription,
        }

        try {
            const res = await fetch("http://localhost:8080/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            // HTTP status check
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Server error ${res.status}: ${text}`);
            }

            const createdTask = await res.json();

            setTasks((prev) => [...prev, createdTask]);
            setNewTitle("");
            setNewDescription("");
            setShowModal(false);

        } catch (err) {
            console.error("Fehler beim Erstellen der Task:", err);
            alert("Task konnte nicht erstellt werden. Details siehe Konsole.");
        }
    };

    const renderTask = (task: Task) => {
        return (
            <div
                key={task.id}
                className={`task-card ${task.completed ? "task-card-checked" : ""}`}
            >
                <button
                    className={`check-btn ${task.completed ? "checked" : ""}`}
                    onClick={() => toggleTask(task.id)}
                >
                </button>

                <div className="task-content">
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-desc">{task.description}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="dashboard">
                <header>
                    <h1>Task Dashboard</h1>
                    <button className="add-btn" id="openPopupBtn" onClick={() => setShowModal(true)}>
                        +
                    </button>
                </header>

                <section>
                    <table>
                        <tbody>
                        {
                            [...tasks]
                            .sort((a, b) => Number(a.completed) - Number(b.completed))
                            .map(renderTask)
                        }
                        </tbody>
                    </table>
                </section>
            </div>

            {showModal && (
                <div className="modal-overlay" id="myPopup">
                    <div className="modal">
                        <h2>Neue Task hinzufügen</h2>
                        <input
                            id="textField1"
                            type="text"
                            placeholder="Titel"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <input
                            id="textField2"
                            placeholder="Beschreibung"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button onClick={() => setShowModal(false)}>Abbrechen</button>
                            <button onClick={addTask} id="submitPopupBtn">Hinzufügen</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
