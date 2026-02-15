package com.bankapp.api.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {
    private final Path auditPath;

    public AuditLogService(@Value("${app.audit.log.path:src/main/resources/logs/audit.log}") String auditPath) {
        this.auditPath = Path.of(auditPath);
    }

    public void log(String actor, String action, String target, String details) {
        try {
            Files.createDirectories(auditPath.getParent());
            String line = String.format("%s | actor=%s | action=%s | target=%s | details=%s%n",
                    LocalDateTime.now(), actor, action, target, details == null ? "" : details);
            Files.writeString(auditPath, line, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException ignored) {
        }
    }

    public List<String> readAll() throws IOException {
        if (!Files.exists(auditPath)) {
            return List.of();
        }
        return Files.readAllLines(auditPath);
    }

    public List<String> readByDay(LocalDate day) throws IOException {
        if (day == null) {
            return readAll();
        }

        return readAll().stream()
                .filter(line -> isLineForDay(line, day))
                .collect(Collectors.toList());
    }

    private boolean isLineForDay(String line, LocalDate day) {
        final int separatorIndex = line.indexOf(" |");
        if (separatorIndex <= 0) {
            return false;
        }

        try {
            LocalDateTime timestamp = LocalDateTime.parse(line.substring(0, separatorIndex).trim());
            return timestamp.toLocalDate().equals(day);
        } catch (Exception ex) {
            return false;
        }
    }
}
