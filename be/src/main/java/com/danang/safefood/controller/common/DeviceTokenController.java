package com.danang.safefood.controller.common;

import com.danang.safefood.dto.request.DeviceTokenRequest;
import com.danang.safefood.config.security.user.CustomUserDetails;
import com.danang.safefood.service.DeviceTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/device-token")
@RequiredArgsConstructor
public class DeviceTokenController {

    private final DeviceTokenService service;

    @PostMapping
    public void save(@RequestBody DeviceTokenRequest req,
                     @AuthenticationPrincipal CustomUserDetails userDetails) {

        service.saveToken(req.token(), userDetails.getUser());
    }
}
