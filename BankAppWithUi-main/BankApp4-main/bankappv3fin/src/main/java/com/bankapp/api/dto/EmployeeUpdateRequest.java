package com.bankapp.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Email;

public record EmployeeUpdateRequest(
        @NotBlank
        @Email(message = "Email format is invalid")
        String emailId,

        @NotBlank
        @Pattern(regexp = "[0-9]{10}", message = "Phone number must be 10 digits")
        String phoneNumber

) {}
