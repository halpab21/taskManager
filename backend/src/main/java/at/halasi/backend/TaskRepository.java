package at.halasi.backend;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    java.util.List<Task> findByDashboardId(Long dashboardId);
    void deleteByDashboardId(Long dashboardId);
}
