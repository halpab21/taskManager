package at.halasi.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class DashboardControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DashboardService dashboardService;

    @InjectMocks
    private DashboardController dashboardController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(dashboardController).build();
    }

    @Test
    void getAllDashboards_returnsList() throws Exception {
        var d1 = Dashboard.builder().id(1L).name("Work").isGroup(false).shareCode(null).build();
        var d2 = Dashboard.builder().id(2L).name("Team").isGroup(true).shareCode("ABC123").build();

        when(dashboardService.getAllDashboards()).thenReturn(List.of(d1, d2));

        mockMvc.perform(get("/dashboards"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Work"))
                .andExpect(jsonPath("$[1].name").value("Team"))
                .andExpect(jsonPath("$[1].shareCode").value("ABC123"));
    }

    @Test
    void createDashboard_personal_success() throws Exception {
        var created = Dashboard.builder().id(1L).name("Work").isGroup(false).shareCode(null).build();
        when(dashboardService.createDashboard(any(DashboardDTO.class))).thenReturn(created);

        mockMvc.perform(post("/dashboard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Work\",\"isGroup\":false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Work"))
                .andExpect(jsonPath("$.isGroup").value(false));
    }

    @Test
    void createDashboard_group_hasShareCode() throws Exception {
        var created = Dashboard.builder().id(2L).name("Team").isGroup(true).shareCode("XYZ999").build();
        when(dashboardService.createDashboard(any(DashboardDTO.class))).thenReturn(created);

        mockMvc.perform(post("/dashboard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Team\",\"isGroup\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shareCode").value("XYZ999"));
    }

    @Test
    void deleteDashboard_success() throws Exception {
        when(dashboardService.deleteDashboard(1L)).thenReturn(true);

        mockMvc.perform(delete("/dashboard/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteDashboard_notFound() throws Exception {
        when(dashboardService.deleteDashboard(999L)).thenReturn(false);

        mockMvc.perform(delete("/dashboard/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getTasksForDashboard_returnsTasks() throws Exception {
        var t1 = Task.builder().id(1L).title("T1").dashboardId(1L).build();
        when(dashboardService.getTasksForDashboard(1L)).thenReturn(List.of(t1));

        mockMvc.perform(get("/dashboard/1/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("T1"));
    }

    @Test
    void joinDashboard_success() throws Exception {
        var dashboard = Dashboard.builder().id(2L).name("Team").isGroup(true).shareCode("ABC123").build();
        when(dashboardService.joinByShareCode("ABC123")).thenReturn(dashboard);

        mockMvc.perform(post("/dashboard/join")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"shareCode\":\"ABC123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shareCode").value("ABC123"));
    }

    @Test
    void joinDashboard_invalidCode_notFound() throws Exception {
        when(dashboardService.joinByShareCode("WRONG1")).thenReturn(null);

        mockMvc.perform(post("/dashboard/join")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"shareCode\":\"WRONG1\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void joinDashboard_missingShareCode_badRequest() throws Exception {
        mockMvc.perform(post("/dashboard/join")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
