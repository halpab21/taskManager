package at.halasi.backend;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;
    private final TaskRepository taskRepository;

    public DashboardService(DashboardRepository dashboardRepository, TaskRepository taskRepository) {
        this.dashboardRepository = dashboardRepository;
        this.taskRepository = taskRepository;
    }

    public List<Dashboard> getAllDashboards() {
        return dashboardRepository.findAll();
    }

    public Dashboard createDashboard(DashboardDTO dto) {
        String shareCode = dto.isGroup() ? generateShareCode() : null;
        Dashboard dashboard = Dashboard.builder()
                .name(dto.name())
                .isGroup(dto.isGroup())
                .shareCode(shareCode)
                .build();
        return dashboardRepository.save(dashboard);
    }

    public boolean deleteDashboard(Long id) {
        if (!dashboardRepository.existsById(id)) return false;
        taskRepository.deleteByDashboardId(id);
        dashboardRepository.deleteById(id);
        return true;
    }

    public List<Task> getTasksForDashboard(Long id) {
        return taskRepository.findByDashboardId(id);
    }

    public Dashboard joinByShareCode(String shareCode) {
        return dashboardRepository.findByShareCode(shareCode).orElse(null);
    }

    private String generateShareCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
