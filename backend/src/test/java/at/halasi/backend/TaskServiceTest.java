package at.halasi.backend;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
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
        var t1 = Task.builder().id(1L).title("A").description("D1").completed(false)
                .priority(Priority.ASAP).deadline(LocalDate.now()).build();
        var t2 = Task.builder().id(2L).title("B").description("D2").completed(true)
                .priority(Priority.SOON).deadline(null).build();

        when(taskRepository.findAll()).thenReturn(List.of(t1, t2));

        var result = taskService.getAllTasks();

        assertThat(result).hasSize(2);
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void getTaskById() {
        var t = Task.builder().id(5L).title("X").description("D").completed(false)
                .priority(Priority.SOMETIME_IN_FUTURE).deadline(LocalDate.of(2026, 2, 15)).build();

        when(taskRepository.findById(5L)).thenReturn(Optional.of(t));

        var result = taskService.getTaskById(5L);

        assertThat(result).isEqualTo(t);
        assertThat(result.getPriority()).isEqualTo(Priority.SOMETIME_IN_FUTURE);
    }

    @Test
    void getTaskById_notFound() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        var result = taskService.getTaskById(999L);

        assertThat(result).isNull();
    }

    @Test
    void createTask_withPriorityAndDeadline() {
        var deadline = LocalDate.of(2026, 3, 1);
        var dto = new TaskDTO("New Task", "Description", Priority.ASAP, deadline);

        var savedTask = Task.builder()
                .id(1L).title("New Task").description("Description")
                .completed(false).priority(Priority.ASAP).deadline(deadline).build();

        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        var result = taskService.createTask(dto);

        assertThat(result.getTitle()).isEqualTo("New Task");
        assertThat(result.getPriority()).isEqualTo(Priority.ASAP);
        assertThat(result.getDeadline()).isEqualTo(deadline);
        assertThat(result.isCompleted()).isFalse();
    }

    @Test
    void createTask_withNullPriority_defaultsToSometimeInFuture() {
        var dto = new TaskDTO("Task", "Desc", null, null);

        var savedTask = Task.builder()
                .id(1L).title("Task").description("Desc")
                .completed(false).priority(Priority.SOMETIME_IN_FUTURE).deadline(null).build();

        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        var result = taskService.createTask(dto);

        assertThat(result.getPriority()).isEqualTo(Priority.SOMETIME_IN_FUTURE);
    }

    @Test
    void updateTask_success() {
        var existingTask = Task.builder()
                .id(1L).title("Old").description("Old Desc")
                .completed(false).priority(Priority.SOON).deadline(null).build();

        var dto = new TaskDTO("Updated", "Updated Desc", Priority.ASAP, LocalDate.of(2026, 5, 1));

        when(taskRepository.findById(1L)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        var result = taskService.updateTask(1L, dto);

        assertThat(result.getTitle()).isEqualTo("Updated");
        assertThat(result.getDescription()).isEqualTo("Updated Desc");
        assertThat(result.getPriority()).isEqualTo(Priority.ASAP);
    }

    @Test
    void updateTask_notFound() {
        var dto = new TaskDTO("Updated", "Updated Desc", Priority.ASAP, null);

        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        var result = taskService.updateTask(999L, dto);

        assertThat(result).isNull();
    }

    @Test
    void toggleTaskCompleted_success() {
        var task = Task.builder()
                .id(1L).title("Task").description("Desc")
                .completed(false).priority(Priority.SOON).deadline(null).build();

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        var result = taskService.toggleTaskCompleted(1L);

        assertThat(result.isCompleted()).isTrue();
    }

    @Test
    void toggleTaskCompleted_notFound() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        var result = taskService.toggleTaskCompleted(999L);

        assertThat(result).isNull();
    }

    @Test
    void deleteTask_success() {
        when(taskRepository.existsById(1L)).thenReturn(true);
        doNothing().when(taskRepository).deleteById(1L);

        var result = taskService.deleteTask(1L);

        assertThat(result).isTrue();
        verify(taskRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteTask_notFound() {
        when(taskRepository.existsById(999L)).thenReturn(false);

        var result = taskService.deleteTask(999L);

        assertThat(result).isFalse();
        verify(taskRepository, never()).deleteById(any());
    }
}
