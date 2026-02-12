package com.bankapp.api.dto;

import java.math.BigDecimal;

public record AccountResponse(

        Long id,
        String accountNumber,
        BigDecimal balance,
        String holderName

) {}