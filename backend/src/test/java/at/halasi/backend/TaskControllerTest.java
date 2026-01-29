package at.halasi.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TaskControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(taskController).build();
    }

    @Test
    void getAllTasks_returnsTaskList() throws Exception {
        var task1 = Task.builder()
                .id(1L).title("Task 1").description("Desc 1")
                .completed(false).priority(Priority.ASAP).deadline(LocalDate.of(2026, 2, 1)).build();
        var task2 = Task.builder()
                .id(2L).title("Task 2").description("Desc 2")
                .completed(true).priority(Priority.SOON).deadline(null).build();

        when(taskService.getAllTasks()).thenReturn(List.of(task1, task2));

        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Task 1"))
                .andExpect(jsonPath("$[0].priority").value("ASAP"))
                .andExpect(jsonPath("$[1].title").value("Task 2"));
    }

    @Test
    void getTaskById_found() throws Exception {
        var task = Task.builder()
                .id(1L).title("Task").description("Desc")
                .completed(false).priority(Priority.SOMETIME_IN_FUTURE).deadline(null).build();

        when(taskService.getTaskById(1L)).thenReturn(task);

        mockMvc.perform(get("/task/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Task"))
                .andExpect(jsonPath("$.priority").value("SOMETIME_IN_FUTURE"));
    }

    @Test
    void getTaskById_notFound() throws Exception {
        when(taskService.getTaskById(999L)).thenReturn(null);

        mockMvc.perform(get("/task/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createTask_success() throws Exception {
        var createdTask = Task.builder()
                .id(1L).title("New Task").description("Description")
                .completed(false).priority(Priority.ASAP).deadline(LocalDate.of(2026, 3, 1)).build();

        when(taskService.createTask(any(TaskDTO.class))).thenReturn(createdTask);

        String json = "{\"title\":\"New Task\",\"description\":\"Description\",\"priority\":\"ASAP\",\"deadline\":\"2026-03-01\"}";

        mockMvc.perform(post("/task")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Task"))
                .andExpect(jsonPath("$.priority").value("ASAP"));
    }

    @Test
    void updateTask_success() throws Exception {
        var updatedTask = Task.builder()
                .id(1L).title("Updated").description("Updated Desc")
                .completed(false).priority(Priority.SOON).deadline(null).build();

        when(taskService.updateTask(eq(1L), any(TaskDTO.class))).thenReturn(updatedTask);

        String json = "{\"title\":\"Updated\",\"description\":\"Updated Desc\",\"priority\":\"SOON\",\"deadline\":null}";

        mockMvc.perform(put("/task/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated"));
    }

    @Test
    void updateTask_notFound() throws Exception {
        when(taskService.updateTask(eq(999L), any(TaskDTO.class))).thenReturn(null);

        String json = "{\"title\":\"Updated\",\"description\":\"Updated Desc\",\"priority\":\"SOON\",\"deadline\":null}";

        mockMvc.perform(put("/task/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isNotFound());
    }

    @Test
    void toggleTaskCompleted_success() throws Exception {
        var toggledTask = Task.builder()
                .id(1L).title("Task").description("Desc")
                .completed(true).priority(Priority.ASAP).deadline(null).build();

        when(taskService.toggleTaskCompleted(1L)).thenReturn(toggledTask);

        mockMvc.perform(patch("/task/1/toggle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    void toggleTaskCompleted_notFound() throws Exception {
        when(taskService.toggleTaskCompleted(999L)).thenReturn(null);

        mockMvc.perform(patch("/task/999/toggle"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteTask_success() throws Exception {
        when(taskService.deleteTask(1L)).thenReturn(true);

        mockMvc.perform(delete("/task/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteTask_notFound() throws Exception {
        when(taskService.deleteTask(999L)).thenReturn(false);

        mockMvc.perform(delete("/task/999"))
                .andExpect(status().isNotFound());
    }
}

