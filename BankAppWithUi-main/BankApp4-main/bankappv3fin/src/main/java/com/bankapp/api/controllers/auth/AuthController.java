package com.bankapp.api.controllers.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.bankapp.api.dto.auth.AuthRequest;
import com.bankapp.api.dto.auth.AuthResponse;
import com.bankapp.api.entities.Employee;
import com.bankapp.api.exceptions.BusinessException;
import com.bankapp.api.repositories.EmployeeRepository;
import com.bankapp.api.security.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final EmployeeRepository employeeRepository;

    @PostMapping("/authenticate")
    public AuthResponse authenticateAndGetToken(@Valid @RequestBody AuthRequest authRequest) {
        if (!employeeRepository.existsByUsernameAndActiveTrue(authRequest.username())) {
            throw new BusinessException("Login failed: username does not exist.");
        }

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.username(), authRequest.password()));
        } catch (BadCredentialsException ex) {
            throw new BusinessException("Login failed: incorrect password.");
        }

        if (authentication.isAuthenticated()) {
            UserDetails user = userDetailsService.loadUserByUsername(authRequest.username());
            Employee employee = employeeRepository.findByUsernameAndActiveTrue(authRequest.username())
                    .orElseThrow(() -> new UsernameNotFoundException("Login failed: user is invalid."));

            return new AuthResponse(
                    jwtService.generateToken(user),
                    employee.getId(),
                    employee.getUsername(),
                    employee.getRole().name(),
                    employee.getFullName(),
                    employee.getEmailId(),
                    employee.getPhoneNumber());
        }

        throw new UsernameNotFoundException("Login failed: user is invalid.");
    }
}
