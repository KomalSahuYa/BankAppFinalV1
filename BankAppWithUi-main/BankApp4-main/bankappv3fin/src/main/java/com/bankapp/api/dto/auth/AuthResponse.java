package com.bankapp.api.dto.auth;

public record AuthResponse(
        String token,
        Long userId,
        String username,
        String role,
        String fullName,
        String emailId,
        String phoneNumber
) {
}
