package com.bankapp.api.dto;

import java.util.List;

public record AuditLogPageResponse(
        List<String> logs,
        int page,
        int size,
        int totalElements,
        int totalPages
) {
}
