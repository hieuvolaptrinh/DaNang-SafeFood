package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record HoSoThanhTraRequest(
        @NotBlank String businessName,
        String address,
        String phone,
        String owner,
        String businessType,
        String inspectionTime,
        String businessLicense,
        String foodSafetyCertificate,
        String healthCertificate,
        String trainingCertificate,
        Map<String, String> checklist,
        String violationStatus,
        String violationDescription,
        @NotBlank String conclusion,
        String generalComment,
        String actionMeasure,
        String recommendation
) {}
