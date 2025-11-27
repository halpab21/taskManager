// ...existing code...
package com.example.taskmanager.service;

import com.example.taskmanager.model.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

class TaskServiceTest {

    private TaskService service;

    @BeforeEach
    void setUp() {
        service = new TaskService();
    }

    @Test
    void create_assignsIdAndStoresTask() {
        Task t = new Task(null, "Title 1", "Desc", false);
        Task created = service.create(t);

        assertThat(created.getId()).isNotNull();
        assertThat(created.getTitle()).isEqualTo("Title 1");
        assertThat(service.findById(created.getId())).isPresent();
    }

    @Test
    void findById_nonExisting_returnsEmpty() {
        Optional<Task> found = service.findById(999L);
        assertThat(found).isEmpty();
    }

    @Test
    void update_existing_updatesFields() {
        Task t = service.create(new Task(null, "Old", "OldDesc", false));
        Task updated = new Task(null, "New", "NewDesc", true);

        Optional<Task> result = service.update(t.getId(), updated);
        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("New");
        assertThat(result.get().isCompleted()).isTrue();
    }

    @Test
    void update_nonExisting_returnsEmpty() {
        Optional<Task> r = service.update(12345L, new Task(null, "x", "y", false));
        assertThat(r).isEmpty();
    }

    @Test
    void delete_existing_removesAndReturnsTrue() {
        Task t = service.create(new Task(null, "ToDelete", "d", false));
        boolean removed = service.delete(t.getId());
        assertThat(removed).isTrue();
        assertThat(service.findById(t.getId())).isEmpty();
    }

    @Test
    void delete_nonExisting_returnsFalse() {
        boolean removed = service.delete(9999L);
        assertThat(removed).isFalse();
    }
}

