package com.danang.safefood.controller.common;

import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/cloudinary")
@RequiredArgsConstructor
@Slf4j
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    /**
     * Upload ảnh lên Cloudinary.
     *
     * @param file file ảnh (JPEG, PNG, GIF, WebP, BMP)
     * @return URL ảnh đã upload
     */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = cloudinaryService.uploadImage(file);
            return ResponseEntity.ok(ApiResponse.success("Upload ảnh thành công", imageUrl));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid image file: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Lỗi: " + e.getMessage()));
        } catch (IOException e) {
            log.error("Error uploading image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Lỗi khi upload ảnh: " + e.getMessage()));
        }
    }

    /**
     * Upload ảnh với tối ưu hóa (auto format, auto quality).
     *
     * @param file file ảnh
     * @return URL ảnh đã upload
     */
    @PostMapping("/upload-optimized")
    public ResponseEntity<ApiResponse<String>> uploadImageOptimized(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = cloudinaryService.uploadImageWithOptimization(file);
            return ResponseEntity.ok(ApiResponse.success("Upload ảnh (tối ưu) thành công", imageUrl));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid image file: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Lỗi: " + e.getMessage()));
        } catch (IOException e) {
            log.error("Error uploading image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Lỗi khi upload ảnh: " + e.getMessage()));
        }
    }

    /**
     * Upload tài liệu (ảnh hoặc PDF/Word) — dùng cho hồ sơ giấy tờ kinh doanh.
     */
    @PostMapping("/upload-document")
    public ResponseEntity<ApiResponse<String>> uploadDocument(@RequestParam("file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadDocument(file);
            return ResponseEntity.ok(ApiResponse.success("Upload tài liệu thành công", url));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid document file: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Lỗi: " + e.getMessage()));
        } catch (IOException e) {
            log.error("Error uploading document: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Lỗi khi upload tài liệu: " + e.getMessage()));
        }
    }

    /**
     * Xóa ảnh từ URL.
     *
     * @param imageUrl URL của ảnh trên Cloudinary
     * @return thông báo xóa
     */
    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<String>> deleteImage(@RequestParam("url") String imageUrl) {
        try {
            String result = cloudinaryService.deleteImageByUrl(imageUrl);
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid image URL: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Lỗi: " + e.getMessage()));
        } catch (IOException e) {
            log.error("Error deleting image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Lỗi khi xóa ảnh: " + e.getMessage()));
        }
    }

    /**
     * Xóa ảnh từ public ID.
     *
     * @param publicId public ID của ảnh trên Cloudinary
     * @return thông báo xóa
     */
    @DeleteMapping("/delete-by-id")
    public ResponseEntity<ApiResponse<String>> deleteImageById(@RequestParam("id") String publicId) {
        try {
            String result = cloudinaryService.deleteImage(publicId);
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (IOException e) {
            log.error("Error deleting image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(500, "Lỗi khi xóa ảnh: " + e.getMessage()));
        }
    }
}
