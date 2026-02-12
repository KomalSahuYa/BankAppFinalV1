package com.bankapp.api.controllers.auth;

import org.springframework.security.authentication.AuthenticationManager;
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
import com.bankapp.api.security.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @PostMapping("/authenticate")
    public AuthResponse authenticateAndGetToken(@Valid @RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.username(), authRequest.password()));

        if (authentication.isAuthenticated()) {
            UserDetails user = userDetailsService.loadUserByUsername(authRequest.username());
            return new AuthResponse(jwtService.generateToken(user));
        }

        throw new UsernameNotFoundException("user is invalid");
    }
}
