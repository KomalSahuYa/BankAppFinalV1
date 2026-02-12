package com.bankapp.api.mappers;

import org.springframework.stereotype.Component;

import com.bankapp.api.dto.EmployeeCreateRequest;
import com.bankapp.api.dto.EmployeeResponse;
import com.bankapp.api.entities.Employee;

@Component
public class EmployeeMapper {

    public Employee toEntity(EmployeeCreateRequest req) {

        Employee emp = new Employee();
        emp.setUsername(req.username());
        emp.setFullName(req.fullName());
        emp.setPassword(req.password());
        emp.setRole(req.role());
        emp.setActive(true);

        return emp;
    }

    public EmployeeResponse toResponse(Employee emp) {

        return new EmployeeResponse(
                emp.getId(),
                emp.getUsername(),
                emp.getRole(),     // Role enum — matches DTO
                emp.getFullName()
        );
    }
}