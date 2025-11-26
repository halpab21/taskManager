package com.example.taskmanager.service;

import com.example.taskmanager.model.Task;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TaskService {
    private final Map<Long, Task> tasks = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public Collection<Task> findAll() {
        return new ArrayList<>(tasks.values());
    }

    public Optional<Task> findById(Long id) {
        return Optional.ofNullable(tasks.get(id));
    }

    public Task create(Task task) {
        Long id = idCounter.getAndIncrement();
        task.setId(id);
        tasks.put(id, task);
        return task;
    }

    public Optional<Task> update(Long id, Task updated) {
        return Optional.ofNullable(tasks.computeIfPresent(id, (k, existing) -> {
            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setCompleted(updated.isCompleted());
            return existing;
        }));
    }

    public boolean delete(Long id) {
        return tasks.remove(id) != null;
    }
}

