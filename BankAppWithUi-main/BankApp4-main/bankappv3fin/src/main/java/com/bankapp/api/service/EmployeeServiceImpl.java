package com.bankapp.api.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bankapp.api.dto.EmployeeCreateRequest;
import com.bankapp.api.dto.EmployeeResponse;
import com.bankapp.api.dto.EmployeeUpdateRequest;
import com.bankapp.api.entities.Employee;
import com.bankapp.api.exceptions.DuplicateUsernameException;
import com.bankapp.api.exceptions.EmployeeNotFoundException;
import com.bankapp.api.mappers.EmployeeMapper;
import com.bankapp.api.repositories.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository repository;
    private final EmployeeMapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public EmployeeResponse create(EmployeeCreateRequest req) {

        repository.findByUsernameAndActiveTrue(req.username())
                .ifPresent(e -> {
                    throw new DuplicateUsernameException(req.username());
                });

        // Convert request → entity
        Employee employee = mapper.toEntity(req);

        // 🔐 Encode password before saving
        employee.setPassword(
                passwordEncoder.encode(employee.getPassword())
        );

        repository.save(employee);

        return mapper.toResponse(employee);
    }

    @Override
    public EmployeeResponse update(Long id,
                                   EmployeeUpdateRequest req) {

        Employee employee = getActiveEmployee(id);

        employee.setFullName(req.fullName());
        employee.setRole(req.role());

        return mapper.toResponse(employee);
    }

    @Override
    public EmployeeResponse getById(Long id) {
        return mapper.toResponse(getActiveEmployee(id));
    }

    @Override
    public List<EmployeeResponse> getAll() {
        return repository.findAllByActiveTrue()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        Employee employee = getActiveEmployee(id);
        employee.setActive(false);
    }

    private Employee getActiveEmployee(Long id) {
        return repository.findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(id));
    }
}