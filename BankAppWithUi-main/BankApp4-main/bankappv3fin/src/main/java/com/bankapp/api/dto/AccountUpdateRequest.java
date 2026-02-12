package com.bankapp.api.dto;
import jakarta.validation.constraints.NotBlank;

public record AccountUpdateRequest(

        @NotBlank
        String holderName

) {}