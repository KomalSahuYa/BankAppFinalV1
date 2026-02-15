package com.bankapp.api.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

class AuditLogServiceTest {

    @TempDir
    Path tempDir;

    private AuditLogService auditLogService;
    private Path logPath;

    @BeforeEach
    void setUp() {
        logPath = tempDir.resolve("audit.log");
        auditLogService = new AuditLogService(logPath.toString());
    }

    @Test
    void log_shouldAppendEntryToAuditFile() throws IOException {
        auditLogService.log("manager", "CREATE_ACCOUNT", "ACC-123", "created by test");

        List<String> lines = Files.readAllLines(logPath);

        assertEquals(1, lines.size());
        assertTrue(lines.get(0).contains("actor=manager"));
        assertTrue(lines.get(0).contains("action=CREATE_ACCOUNT"));
    }

    @Test
    void readByDay_shouldReturnOnlyRequestedDayEntries() throws IOException {
        LocalDate today = LocalDate.now();
        LocalDate previousDay = today.minusDays(1);

        String first = String.format("%sT10:15:00 | actor=manager | action=CREATE | target=A1 | details=ok", today);
        String second = String.format("%sT08:00:00 | actor=clerk | action=UPDATE | target=A2 | details=ok", previousDay);
        Files.write(logPath, List.of(first, second));

        List<String> filtered = auditLogService.readByDay(today);

        assertEquals(1, filtered.size());
        assertTrue(filtered.get(0).contains("target=A1"));
    }
}
