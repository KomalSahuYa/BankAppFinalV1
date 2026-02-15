package com.bankapp.api.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bankapp.api.dto.AuditLogPageResponse;
import com.bankapp.api.service.AuditLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/audit")
@RequiredArgsConstructor
public class AuditController {
    private final AuditLogService auditLogService;

    @GetMapping("/logs")
    @PreAuthorize("hasRole('MANAGER')")
    @ResponseStatus(HttpStatus.OK)
    public AuditLogPageResponse getLogs(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) throws IOException {

        List<String> filteredLogs = auditLogService.readByDay(day);
        List<String> orderedLogs = new ArrayList<>(filteredLogs);
        Collections.reverse(orderedLogs);

        int normalizedSize = Math.max(1, size);
        int totalElements = orderedLogs.size();
        int totalPages = Math.max(1, (int) Math.ceil(totalElements / (double) normalizedSize));
        int normalizedPage = Math.min(Math.max(1, page), totalPages);

        int startIndex = (normalizedPage - 1) * normalizedSize;
        int endIndex = Math.min(startIndex + normalizedSize, totalElements);

        List<String> pagedLogs = startIndex >= totalElements ? List.of() : orderedLogs.subList(startIndex, endIndex);
        return new AuditLogPageResponse(pagedLogs, normalizedPage, normalizedSize, totalElements, totalPages);
    }
}
