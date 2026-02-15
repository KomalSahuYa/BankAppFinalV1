package com.bankapp.api.controllers.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.bankapp.api.dto.auth.AuthRequest;
import com.bankapp.api.dto.auth.AuthResponse;
import com.bankapp.api.entities.Employee;
import com.bankapp.api.entities.enums.Role;
import com.bankapp.api.exceptions.BusinessException;
import com.bankapp.api.repositories.EmployeeRepository;
import com.bankapp.api.security.JwtService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserDetailsService userDetailsService;
    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private AuthController authController;

    @Test
    void authenticateAndGetToken_shouldReturnProfileFieldsFromEmployeeRecord() {
        AuthRequest request = new AuthRequest("manager01", "secret");
        Employee employee = new Employee("manager01", "pwd", Role.MANAGER, "Manager One",
                "manager@test.com", "9876543210", "123412341234");
        employee.setId(10L);

        User principal = new User("manager01", "secret", java.util.List.of(new SimpleGrantedAuthority("ROLE_MANAGER")));
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, "secret", principal.getAuthorities());

        when(employeeRepository.existsByUsernameAndActiveTrue("manager01")).thenReturn(true);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(userDetailsService.loadUserByUsername("manager01")).thenReturn(principal);
        when(jwtService.generateToken(principal)).thenReturn("jwt-token");
        when(employeeRepository.findByUsernameAndActiveTrue("manager01")).thenReturn(Optional.of(employee));

        AuthResponse response = authController.authenticateAndGetToken(request);

        assertEquals("jwt-token", response.token());
        assertEquals(10L, response.userId());
        assertEquals("Manager One", response.fullName());
        assertEquals("manager@test.com", response.emailId());
        assertEquals("9876543210", response.phoneNumber());
    }

    @Test
    void authenticateAndGetToken_shouldThrowBusinessExceptionForBadPassword() {
        AuthRequest request = new AuthRequest("manager01", "bad-secret");

        when(employeeRepository.existsByUsernameAndActiveTrue("manager01")).thenReturn(true);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("bad credentials"));

        assertThrows(BusinessException.class, () -> authController.authenticateAndGetToken(request));
    }
}
