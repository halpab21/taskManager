import React, { useEffect, useState } from 'react'

import { TextField, Checkbox, FormControlLabel, Button, Stack, Paper } from '@mui/material'

export default function TaskForm({ onCreate, editing, onUpdate, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || '')
      setDescription(editing.description || '')
      setCompleted(!!editing.completed)
    } else {
      setTitle('')
      setDescription('')
      setCompleted(false)
    }
  }, [editing])

  const submit = (e) => {
    e.preventDefault()
    const payload = { title, description, completed }
    if (editing && editing.id) onUpdate(editing.id, payload)
    else onCreate(payload)
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }} component="form" onSubmit={submit}>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems="center">
        <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} required fullWidth />
        <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth />
        <FormControlLabel control={<Checkbox checked={completed} onChange={e => setCompleted(e.target.checked)} />} label="Completed" />
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained" color="primary">{editing ? 'Update' : 'Add'}</Button>
          {editing && <Button type="button" variant="outlined" onClick={onCancel}>Cancel</Button>}
        </Stack>
      </Stack>
    </Paper>
  )
}
