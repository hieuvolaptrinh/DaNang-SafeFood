package com.danang.safefood.dto.response;

import java.util.List;

public record ProfileResponse(
        Long id,
        String username,
        String fullName,
        String email,
        String phone,
        List<String> roles
) {}
