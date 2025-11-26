import React, { useEffect, useState } from 'react'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import api from './api/tasks'

import { Container, Typography, Box } from '@mui/material'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [editing, setEditing] = useState(null)

  const load = async () => {
    const res = await api.getAll()
    setTasks(res.data)
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (task) => {
    await api.create(task)
    load()
  }

  const handleUpdate = async (id, task) => {
    await api.update(id, task)
    setEditing(null)
    load()
  }

  const handleDelete = async (id) => {
    await api.delete(id)
    load()
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>Task Manager</Typography>
        <TaskForm onCreate={handleCreate} editing={editing} onUpdate={handleUpdate} onCancel={() => setEditing(null)} />
        <TaskList tasks={tasks} onEdit={t => setEditing(t)} onDelete={handleDelete} />
      </Box>
    </Container>
  )
}
