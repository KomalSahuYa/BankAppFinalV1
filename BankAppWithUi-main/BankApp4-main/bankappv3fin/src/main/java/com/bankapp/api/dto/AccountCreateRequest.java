package com.bankapp.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Email;

import java.math.BigDecimal;

public record AccountCreateRequest(

        @NotBlank String holderName,

        @NotBlank
        @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]", message = "PAN number format is invalid")
        String panNumber,

        @NotBlank
        @Email(message = "Email format is invalid")
        String email,

        @NotBlank
        @Pattern(regexp = "[0-9]{10}", message = "Mobile number must be 10 digits")
        String mobileNumber,

        @Positive BigDecimal initialBalance

) {}
