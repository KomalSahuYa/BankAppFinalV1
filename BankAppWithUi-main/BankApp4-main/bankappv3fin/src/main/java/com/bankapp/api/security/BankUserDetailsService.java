package com.bankapp.api.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.bankapp.api.entities.Employee;
import com.bankapp.api.repositories.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BankUserDetailsService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    	
        Employee employee = employeeRepository.findByUsernameAndActiveTrue(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        String role = "ROLE_" + employee.getRole().name();

        return User.builder()
                .username(employee.getUsername())
                .password(employee.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority(role)))
                .accountLocked(!employee.isActive())
                .disabled(!employee.isActive())
                .build();
    }
    
}
