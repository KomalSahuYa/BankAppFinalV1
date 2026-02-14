package com.bankapp.api.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bankapp.api.dto.EmployeeCreateRequest;
import com.bankapp.api.dto.EmployeeResponse;
import com.bankapp.api.dto.EmployeeUpdateRequest;
import com.bankapp.api.entities.Employee;
import com.bankapp.api.exceptions.DuplicateUsernameException;
import com.bankapp.api.exceptions.DuplicateEmployeeFieldException;
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
    private final AuditLogService auditLogService;

    @Override
    public EmployeeResponse create(EmployeeCreateRequest req) {

        repository.findByUsernameAndActiveTrue(req.username())
                .ifPresent(e -> {
                    throw new DuplicateUsernameException(req.username());
                });
        validateUniqueCreateFields(req.emailId(), req.phoneNumber(), req.aadhaarNumber());

        // Convert request → entity
        Employee employee = mapper.toEntity(req);

        // 🔐 Encode password before saving
        employee.setPassword(
                passwordEncoder.encode(employee.getPassword())
        );

        repository.save(employee);
        auditLogService.log(currentActor(), "CREATE_EMPLOYEE", employee.getUsername(), "role=" + employee.getRole());

        return mapper.toResponse(employee);
    }

    @Override
    public EmployeeResponse update(Long id,
                                   EmployeeUpdateRequest req) {

        Employee employee = getActiveEmployee(id);
        validateUniqueUpdateFields(req.emailId(), req.phoneNumber(), id);
        employee.setEmailId(req.emailId().trim().toLowerCase());
        employee.setPhoneNumber(req.phoneNumber().trim());
        auditLogService.log(currentActor(), "UPDATE_EMPLOYEE", employee.getUsername(), "email/phone updated");

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
        auditLogService.log(currentActor(), "DELETE_EMPLOYEE", employee.getUsername(), "soft-delete");
    }

    @Override
    public boolean usernameExists(String username) {
        return repository.findByUsernameAndActiveTrue(username).isPresent();
    }

    @Override
    public boolean emailExists(String emailId) {
        return repository.existsByEmailIdAndActiveTrue(emailId.trim().toLowerCase());
    }

    @Override
    public boolean phoneExists(String phoneNumber) {
        return repository.existsByPhoneNumberAndActiveTrue(phoneNumber.trim());
    }

    private void validateUniqueCreateFields(String emailId, String phoneNumber, String aadhaarNumber) {
        if (repository.existsByEmailIdAndActiveTrue(emailId.trim().toLowerCase())) {
            throw new DuplicateEmployeeFieldException("Email", emailId);
        }
        if (repository.existsByPhoneNumberAndActiveTrue(phoneNumber.trim())) {
            throw new DuplicateEmployeeFieldException("Phone number", phoneNumber);
        }
        if (repository.existsByAadhaarNumberAndActiveTrue(aadhaarNumber.trim())) {
            throw new DuplicateEmployeeFieldException("Aadhaar number", aadhaarNumber);
        }
    }

    private void validateUniqueUpdateFields(String emailId, String phoneNumber, Long id) {
        if (repository.existsByEmailIdAndIdNotAndActiveTrue(emailId.trim().toLowerCase(), id)) {
            throw new DuplicateEmployeeFieldException("Email", emailId);
        }
        if (repository.existsByPhoneNumberAndIdNotAndActiveTrue(phoneNumber.trim(), id)) {
            throw new DuplicateEmployeeFieldException("Phone number", phoneNumber);
        }
    }

    private Employee getActiveEmployee(Long id) {
        return repository.findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(id));
    }

    private String currentActor() {
        return SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : "SYSTEM";
    }
}
