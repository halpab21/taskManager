package at.halasi.backend;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DashboardDTO(String name, @JsonProperty("isGroup") boolean isGroup) {}
