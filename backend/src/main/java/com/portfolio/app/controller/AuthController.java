package com.portfolio.app.controller;

import com.portfolio.app.dto.AuthResponse;
import com.portfolio.app.dto.LoginRequest;
import com.portfolio.app.security.CustomUserDetails;
import com.portfolio.app.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    /**
     * Username/password login for the admin.
     * On success, returns a JWT that the Angular admin dashboard stores and sends
     * as "Authorization: Bearer <token>" on every subsequent admin API call.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String role = userDetails.getAdminUser().getRole();
            String token = jwtUtil.generateToken(userDetails.getUsername(), role);

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .tokenType("Bearer")
                    .username(userDetails.getUsername())
                    .role(role)
                    .build());

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).build();
        }
    }
}
