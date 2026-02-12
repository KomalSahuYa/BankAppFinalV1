package com.bankapp.api.dto;

import com.bankapp.api.entities.enums.Role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EmployeeUpdateRequest(

        @NotBlank(message = "{employee.fullname.required}")
        String fullName,

        @NotNull(message = "{employee.role.required}")
        Role role

) {}