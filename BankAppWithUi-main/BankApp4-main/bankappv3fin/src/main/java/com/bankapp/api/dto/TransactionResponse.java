package com.bankapp.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        String accountNumber,
        String type,
        BigDecimal amount,
        String status,
        LocalDateTime timestamp
) {}