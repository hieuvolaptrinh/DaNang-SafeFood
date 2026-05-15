package com.danang.safefood.controller.common;

import com.danang.safefood.security.jwt.JwtPrincipal;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.ThongBaoResponse;
import com.danang.safefood.entity.NguoiDung;
import com.danang.safefood.repository.NguoiDungRepository;
import com.danang.safefood.service.ThongBaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("commonThongBaoController")
@RequestMapping("/api/thong-bao")
@RequiredArgsConstructor
public class ThongBaoController {

    private final ThongBaoService thongBaoService;
    private final NguoiDungRepository nguoiDungRepository;

    /**
     * API 1: Lấy thông báo CỘNG ĐỒNG (isCongDong = true).
     * Ai cũng xem được, chỉ cần đăng nhập (có token).
     */
    @GetMapping("/cong-dong")
    public ResponseEntity<ApiResponse<List<ThongBaoResponse>>> getCommunityNotifications() {
        List<ThongBaoResponse> notifications = thongBaoService.getCommunityNotifications();
        return ResponseEntity.ok(ApiResponse.success("Lấy thông báo cộng đồng thành công", notifications));
    }

    /**
     * API 2: Lấy thông báo CÁ NHÂN của người dùng (qua bảng thong_bao_nguoi_dung).
     * Sử dụng JWT token để xác định người dùng, không cần truyền ID.
     */
    @GetMapping("/ca-nhan")
    public ResponseEntity<ApiResponse<List<ThongBaoResponse>>> getPersonalNotifications(
            @AuthenticationPrincipal JwtPrincipal jwt
    ) {
        NguoiDung nguoiDung = nguoiDungRepository.findByTaiKhoan_Id(jwt.userId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy người dùng với tài khoản: " + jwt.username()));

        List<ThongBaoResponse> notifications = thongBaoService.getPersonalNotifications(nguoiDung.getMaNguoiDung());

        return ResponseEntity.ok(ApiResponse.success("Lấy thông báo cá nhân thành công", notifications));
    }
}
