package at.halasi.backend;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class DashboardServiceIT extends AbstractPostgresIT {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private DashboardRepository dashboardRepository;

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepository taskRepository;

    @AfterEach
    void cleanup() {
        taskRepository.deleteAll();
        dashboardRepository.deleteAll();
    }

    @Test
    void createDashboard_personalAndGroup_savedCorrectly() {
        var personal = dashboardService.createDashboard(new DashboardDTO("Work", false));
        var group = dashboardService.createDashboard(new DashboardDTO("Team", true));

        assertThat(personal.getId()).isNotNull();
        assertThat(personal.isGroup()).isFalse();
        assertThat(personal.getShareCode()).isNull();

        assertThat(group.getId()).isNotNull();
        assertThat(group.isGroup()).isTrue();
        assertThat(group.getShareCode()).isNotNull().hasSize(6);
    }

    @Test
    void createTasksInDashboard_fetchByDashboardId() {
        var dashboard = dashboardService.createDashboard(new DashboardDTO("Work", false));

        var dto1 = new TaskDTO("Task A", "Desc A", Priority.ASAP, LocalDate.of(2026, 6, 1), null, dashboard.getId());
        var dto2 = new TaskDTO("Task B", "Desc B", Priority.SOON, null, null, dashboard.getId());
        taskService.createTask(dto1);
        taskService.createTask(dto2);

        List<Task> tasks = dashboardService.getTasksForDashboard(dashboard.getId());
        assertThat(tasks).hasSize(2);
        assertThat(tasks).extracting(Task::getTitle).containsExactlyInAnyOrder("Task A", "Task B");
        assertThat(tasks).allSatisfy(t -> assertThat(t.getDashboardId()).isEqualTo(dashboard.getId()));
    }

    @Test
    void deleteDashboard_alsoDeletesItsTask() {
        var dashboard = dashboardService.createDashboard(new DashboardDTO("Temp", false));
        taskService.createTask(new TaskDTO("Orphan", "Desc", Priority.SOON, null, null, dashboard.getId()));

        assertThat(taskRepository.findByDashboardId(dashboard.getId())).hasSize(1);

        boolean deleted = dashboardService.deleteDashboard(dashboard.getId());

        assertThat(deleted).isTrue();
        assertThat(dashboardRepository.existsById(dashboard.getId())).isFalse();
        assertThat(taskRepository.findByDashboardId(dashboard.getId())).isEmpty();
    }

    @Test
    void joinByShareCode_returnsCorrectDashboard() {
        var group = dashboardService.createDashboard(new DashboardDTO("Team", true));
        String code = group.getShareCode();

        Dashboard found = dashboardService.joinByShareCode(code);

        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(group.getId());
        assertThat(found.getShareCode()).isEqualTo(code);
    }

    @Test
    void joinByShareCode_wrongCode_returnsNull() {
        var result = dashboardService.joinByShareCode("XXXXXX");
        assertThat(result).isNull();
    }

    @Test
    void getAllDashboards_returnsAll() {
        dashboardService.createDashboard(new DashboardDTO("A", false));
        dashboardService.createDashboard(new DashboardDTO("B", true));

        List<Dashboard> all = dashboardService.getAllDashboards();

        assertThat(all).hasSizeGreaterThanOrEqualTo(2);
    }
}
