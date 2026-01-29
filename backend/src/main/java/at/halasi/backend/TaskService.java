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
                .priority(taskDTO.priority() != null ? taskDTO.priority() : Priority.SOMETIME_IN_FUTURE)
                .deadline(taskDTO.deadline())
                .build();

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) {
            return null;
        }
        task.setTitle(taskDTO.title());
        task.setDescription(taskDTO.description());
        task.setPriority(taskDTO.priority());
        task.setDeadline(taskDTO.deadline());
        return taskRepository.save(task);
    }

    public Task toggleTaskCompleted(Long id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) {
            return null;
        }
        task.setCompleted(!task.isCompleted());
        return taskRepository.save(task);
    }

    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
