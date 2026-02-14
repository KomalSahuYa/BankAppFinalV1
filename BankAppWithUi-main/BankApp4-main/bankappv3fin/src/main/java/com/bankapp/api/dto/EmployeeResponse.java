package com.bankapp.api.dto;

import com.bankapp.api.entities.enums.Role;

public record EmployeeResponse(

        Long id,
        String username,
        Role role,
        String fullName,
        String emailId,
        String phoneNumber,
        String aadhaarNumber

) {}
