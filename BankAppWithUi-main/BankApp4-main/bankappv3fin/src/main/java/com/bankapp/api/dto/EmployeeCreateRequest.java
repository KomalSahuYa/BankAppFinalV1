package com.bankapp.api.dto;
import com.bankapp.api.entities.enums.Role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;



public record EmployeeCreateRequest(

        @NotBlank(message = "{employee.username.required}")
        @Size( max = 20,
              message = "{employee.username.size}")
        String username,

        @NotBlank(message = "{employee.password.required}")
        @Size(min = 6,
              message = "{employee.password.size}")
        String password,

        @NotNull(message = "{employee.role.required}")
        Role role,

        @NotBlank(message = "{employee.fullname.required}")
        String fullName

) {}