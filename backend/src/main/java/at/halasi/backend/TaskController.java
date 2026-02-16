package at.halasi.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("favicon.ico")
    public void ignoreFavicon() {

    }


    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/task/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return task != null
                ? ResponseEntity.ok(task)
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/task")
    public ResponseEntity<Task> createTask(@RequestBody TaskDTO dto) {
        return ResponseEntity.ok(taskService.createTask(dto));
    }

    @PutMapping("/task/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody TaskDTO dto) {
        Task task = taskService.updateTask(id, dto);
        return task != null
                ? ResponseEntity.ok(task)
                : ResponseEntity.notFound().build();
    }

    @PatchMapping("/task/{id}/toggle")
    public ResponseEntity<Task> toggleTaskCompleted(@PathVariable Long id) {
        Task task = taskService.toggleTaskCompleted(id);
        return task != null
                ? ResponseEntity.ok(task)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/task/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        return taskService.deleteTask(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
