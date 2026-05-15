package com.danang.safefood.controller.user;

import com.danang.safefood.config.security.jwt.JwtPrincipal;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.ViPhamResponse;
import com.danang.safefood.entity.ViPham;
import com.danang.safefood.repository.CoSoKinhDoanhRepository;
import com.danang.safefood.repository.ViPhamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * API cho CSKD:
 *  - GET /api/user/vi-pham        — lấy danh sách vi phạm thuộc các cơ sở mình sở hữu
 *  - GET /api/user/vi-pham/{id}   — chi tiết 1 vi phạm
 */
@RestController("userViPhamController")
@RequestMapping("/api/user/vi-pham")
@RequiredArgsConstructor
public class ViPhamController {

    private final ViPhamRepository viPhamRepository;
    private final CoSoKinhDoanhRepository coSoRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<ViPhamResponse>>> getMyViolations(
            @AuthenticationPrincipal JwtPrincipal jwt) {
        if (jwt == null || jwt.userId() == null) {
            throw new RuntimeException("Không thể xác định người dùng");
        }

        // Lấy tất cả mã cơ sở thuộc CSKD này
        var coSoIds = coSoRepository
                .findByChuSoHuu_TaiKhoan_Id(jwt.userId())
                .stream()
                .map(c -> c.getMaCoSo())
                .toList();

        if (coSoIds.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success(List.of()));
        }

        // Lọc tất cả vi phạm thuộc các cơ sở
        var viPhamList = viPhamRepository.findAll().stream()
                .filter(v -> v.getCoSoKinhDoanh() != null
                        && coSoIds.contains(v.getCoSoKinhDoanh().getMaCoSo()))
                .map(ViPhamResponse::from)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(viPhamList));
    }

    @GetMapping("/{maViPham}")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<ViPhamResponse>> getDetail(@PathVariable String maViPham) {
        ViPham vp = viPhamRepository.findById(maViPham)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vi phạm: " + maViPham));
        return ResponseEntity.ok(ApiResponse.success(ViPhamResponse.from(vp)));
    }
}
