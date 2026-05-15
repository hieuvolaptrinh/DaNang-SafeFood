package com.danang.safefood.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.folder:da-nang-safe-food}")
    private String folder;

    public String uploadImage(MultipartFile file) throws IOException {
        validateImageFile(file);

        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "resource_type", "image",
                "folder", folder,
                "use_filename", true,
                "unique_filename", true,
                "overwrite", false
        );

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
        return uploadResult.get("secure_url").toString();
    }

    public String uploadImageWithOptimization(MultipartFile file) throws IOException {
        validateImageFile(file);

        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "resource_type", "image",
                "folder", folder,
                "use_filename", true,
                "unique_filename", true,
                "overwrite", false,
                "transformation", "q_auto,f_auto,c_limit,w_1920,h_1080"
        );

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
        return uploadResult.get("secure_url").toString();
    }

    public String deleteImageByUrl(String imageUrl) throws IOException {
        String publicId = extractPublicIdFromUrl(imageUrl);
        return deleteImage(publicId);
    }

    public String deleteImage(String publicId) throws IOException {
        try {
            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String status = String.valueOf(result.get("result"));

            if ("ok".equals(status)) {
                return "Xóa ảnh thành công";
            }
            if ("not found".equals(status)) {
                return "Không tìm thấy ảnh với ID: " + publicId;
            }
            return "Xóa ảnh thất bại: " + status;
        } catch (Exception e) {
            log.error("Error deleting image {}: {}", publicId, e.getMessage());
            throw new IOException("Lỗi khi xóa ảnh: " + e.getMessage(), e);
        }
    }

    private String extractPublicIdFromUrl(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
            throw new IllegalArgumentException("URL không hợp lệ hoặc không phải từ Cloudinary");
        }

        try {
            String[] parts = imageUrl.split("/upload/");
            if (parts.length < 2) {
                throw new IllegalArgumentException("URL Cloudinary không hợp lệ");
            }

            String afterUpload = parts[1];
            if (afterUpload.startsWith("v")) {
                int firstSlash = afterUpload.indexOf('/');
                if (firstSlash > 0) {
                    afterUpload = afterUpload.substring(firstSlash + 1);
                }
            }

            int lastDotIndex = afterUpload.lastIndexOf('.');
            return lastDotIndex > 0 ? afterUpload.substring(0, lastDotIndex) : afterUpload;
        } catch (Exception e) {
            throw new IllegalArgumentException("Không thể trích xuất public ID từ URL: " + imageUrl, e);
        }
    }

    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }

        String contentType = file.getContentType();
        List<String> allowedTypes = Arrays.asList(
                "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp");

        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new IllegalArgumentException("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP, BMP)");
        }

        long maxSizeInBytes = 10 * 1024 * 1024;
        if (file.getSize() > maxSizeInBytes) {
            throw new IllegalArgumentException("Kích thước file không được vượt quá 10MB");
        }
    }
}