package com.danang.safefood.controller.user;

import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.CoSoKinhDoanhDetailResponse;
import com.danang.safefood.dto.response.CoSoKinhDoanhSearchResponse;
import com.danang.safefood.service.CoSoKinhDoanhService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/co-so-kinh-doanh")
@RequiredArgsConstructor
@Tag(name = "User - Cơ Sở Kinh Doanh", description = "API tra cứu thông tin cơ sở kinh doanh cho người dùng")
public class CoSoKinhDoanhController {

    private final CoSoKinhDoanhService coSoKinhDoanhService;

    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm cơ sở kinh doanh", 
               description = "Tìm kiếm cơ sở kinh doanh với filter theo từ khóa, trạng thái, phường xã")
    public ResponseEntity<ApiResponse<Page<CoSoKinhDoanhSearchResponse>>> search(
            @Parameter(description = "Từ khóa tìm kiếm (tên cơ sở, số giấy phép)")
            @RequestParam(required = false) String keyword,
            
            @Parameter(description = "Trạng thái cơ sở (Hoat dong, Vi pham, Tam dung, ...)")
            @RequestParam(required = false) String trangThai,
            
            @Parameter(description = "Mã phường xã (PX001, PX002, ...)")
            @RequestParam(required = false) String maPX,
            
            @Parameter(description = "Số trang (bắt đầu từ 0)")
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Số lượng kết quả mỗi trang")
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CoSoKinhDoanhSearchResponse> result = coSoKinhDoanhService.search(keyword, trangThai, maPX, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết cơ sở kinh doanh", 
               description = "Lấy thông tin chi tiết cơ sở kinh doanh bao gồm chứng nhận và giấy phép")
    public ResponseEntity<ApiResponse<CoSoKinhDoanhDetailResponse>> getDetail(
            @Parameter(description = "Mã cơ sở kinh doanh")
            @PathVariable String id
    ) {
        CoSoKinhDoanhDetailResponse detail = coSoKinhDoanhService.getDetailById(id);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }
}
