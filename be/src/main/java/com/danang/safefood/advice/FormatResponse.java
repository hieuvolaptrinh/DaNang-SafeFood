package com.danang.safefood.advice;

import com.danang.safefood.dto.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@ControllerAdvice
public class FormatResponse implements ResponseBodyAdvice<Object> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public boolean supports(MethodParameter returnType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        // Áp dụng cho tất cả response
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {

        HttpServletResponse servletResponse =
                ((ServletServerHttpResponse) response).getServletResponse();

        int status = servletResponse.getStatus();

        // ✅ 1. Nếu đã là ApiResponse thì không wrap nữa
        if (body instanceof ApiResponse) {
            return body;
        }

        // ✅ 2. Xử lý riêng cho String (tránh lỗi JSON)
        if (body instanceof String) {
            ApiResponse<Object> apiResponse =
                    new ApiResponse<>(status, "Success", body);
            try {
                return objectMapper.writeValueAsString(apiResponse);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        // ✅ 3. Xử lý lỗi (status >= 400)
        if (status >= 400) {
            ApiResponse<Object> apiResponse = new ApiResponse<>();
            apiResponse.setCode(status);

            if (body instanceof String) {
                apiResponse.setMessage((String) body);
            } else {
                apiResponse.setMessage("Error occurred");
                apiResponse.setData(body);
            }

            return apiResponse;
        }

        // ✅ 4. Response bình thường
        return ApiResponse.success(body);
    }
}
