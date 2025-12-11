import { useState } from "react";
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
            const updated = prev.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            );
            const incomplete = updated.filter((t) => !t.completed);
            const complete = updated.filter((t) => t.completed);
            return [...incomplete, ...complete];
        });
    };

    const addTask = async () => {
        if (!newTitle.trim()) return;
        const newTask: Task = {
            id: Date.now(),
            title: newTitle,
            description: newDescription,
            completed: false,
        };

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

    const incompleteTasks = tasks.filter((t) => !t.completed);
    const completeTasks = tasks.filter((t) => t.completed);

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
                    <h2>Offen</h2>
                    <table>
                        <thead>
                        <tr>
                            <th></th>
                            <th>Titel</th>
                            <th>Beschreibung</th>
                        </tr>
                        </thead>
                        <tbody>
                        {incompleteTasks.map((task) => (
                            <tr key={task.id}>
                                <td>
                                    <button
                                        className="check-btn"
                                        onClick={() => toggleTask(task.id)}
                                    ></button>
                                </td>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                <div className="divider"></div>

                <section>
                    <h2>Erledigt</h2>
                    <table>
                        <thead>
                        <tr>
                            <th></th>
                            <th>Titel</th>
                            <th>Beschreibung</th>
                        </tr>
                        </thead>
                        <tbody>
                        {completeTasks.map((task) => (
                            <tr key={task.id}>
                                <td>
                                    <button
                                        className="check-btn checked"
                                        onClick={() => toggleTask(task.id)}
                                    >
                                        ✓
                                    </button>
                                </td>
                                <td className="completed">{task.title}</td>
                                <td className="completed">{task.description}</td>
                            </tr>
                        ))}
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
