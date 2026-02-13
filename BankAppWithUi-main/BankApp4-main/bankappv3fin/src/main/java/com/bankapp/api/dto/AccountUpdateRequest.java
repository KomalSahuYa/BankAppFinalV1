package com.bankapp.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AccountUpdateRequest(

        @NotBlank
        @Email(message = "Email format is invalid")
        String email,

        @NotBlank
        @Pattern(regexp = "[0-9]{10}", message = "Mobile number must be 10 digits")
        String mobileNumber

) {}
