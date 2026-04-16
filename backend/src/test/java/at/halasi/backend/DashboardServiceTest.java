package at.halasi.backend;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class DashboardServiceTest {

    @Mock
    DashboardRepository dashboardRepository;

    @Mock
    TaskRepository taskRepository;

    @InjectMocks
    DashboardService dashboardService;

    DashboardServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllDashboards_returnsAll() {
        var d1 = Dashboard.builder().id(1L).name("Work").isGroup(false).shareCode(null).build();
        var d2 = Dashboard.builder().id(2L).name("Team").isGroup(true).shareCode("ABC123").build();

        when(dashboardRepository.findAll()).thenReturn(List.of(d1, d2));

        var result = dashboardService.getAllDashboards();

        assertThat(result).hasSize(2);
        verify(dashboardRepository, times(1)).findAll();
    }

    @Test
    void createDashboard_personal_noShareCode() {
        var dto = new DashboardDTO("Work", false);
        var saved = Dashboard.builder().id(1L).name("Work").isGroup(false).shareCode(null).build();

        when(dashboardRepository.save(any(Dashboard.class))).thenReturn(saved);

        var result = dashboardService.createDashboard(dto);

        assertThat(result.getName()).isEqualTo("Work");
        assertThat(result.isGroup()).isFalse();
        assertThat(result.getShareCode()).isNull();
        verify(dashboardRepository).save(any(Dashboard.class));
    }

    @Test
    void createDashboard_group_generatesShareCode() {
        var dto = new DashboardDTO("Team", true);
        when(dashboardRepository.save(any(Dashboard.class))).thenAnswer(inv -> {
            Dashboard d = inv.getArgument(0);
            d.setId(2L);
            return d;
        });

        var result = dashboardService.createDashboard(dto);

        assertThat(result.isGroup()).isTrue();
        assertThat(result.getShareCode()).isNotNull().hasSize(6);
        assertThat(result.getShareCode()).matches("[A-Z0-9]{6}");
    }

    @Test
    void deleteDashboard_success_deletesTasksToo() {
        when(dashboardRepository.existsById(1L)).thenReturn(true);
        doNothing().when(taskRepository).deleteByDashboardId(1L);
        doNothing().when(dashboardRepository).deleteById(1L);

        var result = dashboardService.deleteDashboard(1L);

        assertThat(result).isTrue();
        verify(taskRepository).deleteByDashboardId(1L);
        verify(dashboardRepository).deleteById(1L);
    }

    @Test
    void deleteDashboard_notFound_returnsFalse() {
        when(dashboardRepository.existsById(999L)).thenReturn(false);

        var result = dashboardService.deleteDashboard(999L);

        assertThat(result).isFalse();
        verify(taskRepository, never()).deleteByDashboardId(any());
        verify(dashboardRepository, never()).deleteById(any());
    }

    @Test
    void getTasksForDashboard_returnsTasks() {
        var t1 = Task.builder().id(1L).title("T1").dashboardId(1L).build();
        var t2 = Task.builder().id(2L).title("T2").dashboardId(1L).build();

        when(taskRepository.findByDashboardId(1L)).thenReturn(List.of(t1, t2));

        var result = dashboardService.getTasksForDashboard(1L);

        assertThat(result).hasSize(2);
        verify(taskRepository).findByDashboardId(1L);
    }

    @Test
    void joinByShareCode_found() {
        var dashboard = Dashboard.builder().id(2L).name("Team").isGroup(true).shareCode("ABC123").build();
        when(dashboardRepository.findByShareCode("ABC123")).thenReturn(Optional.of(dashboard));

        var result = dashboardService.joinByShareCode("ABC123");

        assertThat(result).isNotNull();
        assertThat(result.getShareCode()).isEqualTo("ABC123");
    }

    @Test
    void joinByShareCode_notFound_returnsNull() {
        when(dashboardRepository.findByShareCode("INVALID")).thenReturn(Optional.empty());

        var result = dashboardService.joinByShareCode("INVALID");

        assertThat(result).isNull();
    }
}
