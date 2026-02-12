package com.bankapp.api.dto;

import java.math.BigDecimal;
import java.util.List;

public record AccountFullResponse(
        String accountNumber,
        String holderName,
        BigDecimal balance,
        List<TransactionResponse> transactions
) {}