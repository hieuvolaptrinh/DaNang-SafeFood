package com.danang.safefood.controller.common;

import com.danang.safefood.dto.auth.AuthRequest;
import com.danang.safefood.dto.auth.AuthResponse;
import com.danang.safefood.dto.auth.MobileAuthRequest;
import com.danang.safefood.dto.auth.RefreshTokenRequest;
import com.danang.safefood.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authenticationService.login(request.username(), request.password()));
    }

    @PostMapping("/login-mobile")
    public ResponseEntity<AuthResponse> loginMobile(@Valid @RequestBody MobileAuthRequest request) {
        return ResponseEntity.ok(authenticationService.loginMobile(request.identifier(), request.password()));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authenticationService.refreshToken(request.refreshToken()));
    }
}

