package at.halasi.backend;

import java.time.LocalDate;

public record TaskDTO(String title, String description, Priority priority, LocalDate deadline) {}
