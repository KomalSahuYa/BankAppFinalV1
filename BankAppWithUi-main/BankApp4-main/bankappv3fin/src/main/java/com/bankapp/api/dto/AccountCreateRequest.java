package com.bankapp.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record AccountCreateRequest(

        @NotBlank String holderName,

        @Positive BigDecimal initialBalance

) {}