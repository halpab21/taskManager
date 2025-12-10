package at.halasi.backend;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    TaskRepository taskRepository;

    @InjectMocks
    TaskService taskService;

    TaskServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllTasks() {
        var t1 = Task.builder().id(1L).title("A").description("D1").completed(false).build();
        var t2 = Task.builder().id(2L).title("B").description("D2").completed(true).build();

        when(taskRepository.findAll()).thenReturn(List.of(t1, t2));

        var result = taskService.getAllTasks();

        assertThat(result).hasSize(2);
    }

    @Test
    void getTaskById() {
        var t = Task.builder().id(5L).title("X").description("D").completed(false).build();

        when(taskRepository.findById(5L)).thenReturn(Optional.of(t));

        var result = taskService.getTaskById(5L);

        assertThat(result).isEqualTo(t);
    }
}
