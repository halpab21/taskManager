package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
//import com.example.taskmanager.repository.TaskRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TaskControllerIT {

    @Autowired
    private MockMvc mvc;

    /*
    @Autowired(required = false)
    private TaskRepository repo; // optional: repo may not exist in this project; controller uses in-memory service
    /**/

    @Autowired
    private ObjectMapper om;

    /*
    @BeforeEach
    void clean() {
        // If a JPA repository exists, clear it; otherwise nothing to do because service is in-memory
        if (repo != null) repo.deleteAll();
    }/**/

    @Test
    void getAll_returnsOk() throws Exception {
        // create a task via POST then GET
        Task t = new Task(null, "IT Task", "desc", false);

        mvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(t)))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").isNumber());

        mvc.perform(get("/api/tasks"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].title").value("IT Task"));
    }

    @Test
    void post_invalid_returnsBadRequest() throws Exception {
        Task invalid = new Task(null, "", "d", false);
        mvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(invalid)))
           .andExpect(status().isBadRequest());
    }
}
