package at.halasi.backend;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    public Task createTask(TaskDTO taskDTO) {
        Task task = Task.builder()
                .title(taskDTO.title())
                .description(taskDTO.description())
                .completed(false)
                .build();

        return taskRepository.save(task);
    }
}
