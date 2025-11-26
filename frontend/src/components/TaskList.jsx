import React from 'react'

import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, Paper, Stack, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function TaskList({ tasks, onEdit, onDelete }) {
  if (!tasks.length) return <Typography>No tasks yet.</Typography>

  return (
    <Paper>
      <List>
        {tasks.map(t => (
          <ListItem key={t.id} divider secondaryAction={
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => onEdit(t)}><EditIcon /></IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(t.id)}><DeleteIcon /></IconButton>
            </ListItemSecondaryAction>
          }>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
              <Checkbox checked={!!t.completed} disabled />
              <ListItemText primary={<strong>{t.title}</strong>} secondary={t.description} />
            </Stack>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
