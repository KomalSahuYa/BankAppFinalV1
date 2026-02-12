package com.bankapp.api.service;

import java.util.List;

import com.bankapp.api.dto.EmployeeCreateRequest;
import com.bankapp.api.dto.EmployeeResponse;
import com.bankapp.api.dto.EmployeeUpdateRequest;

public interface EmployeeService {

    EmployeeResponse create(EmployeeCreateRequest request);

    EmployeeResponse update(Long id,
                            EmployeeUpdateRequest request);

    EmployeeResponse getById(Long id);

    List<EmployeeResponse> getAll();

    void delete(Long id);
}