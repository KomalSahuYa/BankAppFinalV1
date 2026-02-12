package com.bankapp.api.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record WithdrawRequest(

        @NotBlank(message = "{txn.account.required}")
        String accountNumber,

        @NotNull(message = "{txn.amount.required}")
        @DecimalMin(value = "0.01",
                message = "{txn.amount.positive}")
        BigDecimal amount

) {}