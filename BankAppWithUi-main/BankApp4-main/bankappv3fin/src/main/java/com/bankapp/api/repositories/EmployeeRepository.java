package com.bankapp.api.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bankapp.api.entities.Employee;

public interface EmployeeRepository
extends JpaRepository<Employee, Long> {

Optional<Employee> findByUsernameAndActiveTrue(String username);

Optional<Employee> findByIdAndActiveTrue(Long id);

List<Employee> findAllByActiveTrue();

boolean existsByEmailIdAndActiveTrue(String emailId);

boolean existsByPhoneNumberAndActiveTrue(String phoneNumber);

boolean existsByAadhaarNumberAndActiveTrue(String aadhaarNumber);

boolean existsByEmailIdAndIdNotAndActiveTrue(String emailId, Long id);

boolean existsByPhoneNumberAndIdNotAndActiveTrue(String phoneNumber, Long id);
}
