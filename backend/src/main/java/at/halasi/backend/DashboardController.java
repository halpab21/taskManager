package at.halasi.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboards")
    public ResponseEntity<List<Dashboard>> getAllDashboards() {
        return ResponseEntity.ok(dashboardService.getAllDashboards());
    }

    @PostMapping("/dashboard")
    public ResponseEntity<Dashboard> createDashboard(@RequestBody DashboardDTO dto) {
        return ResponseEntity.ok(dashboardService.createDashboard(dto));
    }

    @DeleteMapping("/dashboard/{id}")
    public ResponseEntity<Void> deleteDashboard(@PathVariable Long id) {
        return dashboardService.deleteDashboard(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/dashboard/{id}/tasks")
    public ResponseEntity<List<Task>> getTasksForDashboard(@PathVariable Long id) {
        return ResponseEntity.ok(dashboardService.getTasksForDashboard(id));
    }

    @PostMapping("/dashboard/join")
    public ResponseEntity<Dashboard> joinDashboard(@RequestBody Map<String, String> body) {
        String shareCode = body.get("shareCode");
        if (shareCode == null || shareCode.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Dashboard dashboard = dashboardService.joinByShareCode(shareCode);
        return dashboard != null
                ? ResponseEntity.ok(dashboard)
                : ResponseEntity.notFound().build();
    }
}
