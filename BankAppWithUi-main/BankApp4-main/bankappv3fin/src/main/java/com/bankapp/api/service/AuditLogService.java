package com.bankapp.api.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class AuditLogService {
    private static final Path AUDIT_PATH = Path.of("src", "main", "resources", "logs", "audit.log");

    public void log(String actor, String action, String target, String details) {
        try {
            Files.createDirectories(AUDIT_PATH.getParent());
            String line = String.format("%s | actor=%s | action=%s | target=%s | details=%s%n",
                    LocalDateTime.now(), actor, action, target, details == null ? "" : details);
            Files.writeString(AUDIT_PATH, line, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException ignored) {
        }
    }

    public List<String> readAll() throws IOException {
        if (!Files.exists(AUDIT_PATH)) {
            return List.of();
        }
        return Files.readAllLines(AUDIT_PATH);
    }
}
