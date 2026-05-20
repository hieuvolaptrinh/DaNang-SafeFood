package com.danang.safefood.service;

import com.danang.safefood.dto.response.LogResponse;
import com.danang.safefood.entity.Log;
import com.danang.safefood.entity.NguoiDung;
import com.danang.safefood.entity.TaiKhoan;
import com.danang.safefood.repository.LogRepository;
import com.danang.safefood.repository.NguoiDungRepository;
import com.danang.safefood.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogService {

    private final LogRepository logRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final AiLogClient aiLogClient;

    /**
     * Ghi nhận một phiên đăng nhập và gọi AI service đánh giá có bất thường hay không.
     *
     * @return entity Log đã lưu (kèm cờ isAbnormal); trả về null nếu user không có
     *         hồ sơ NguoiDung tương ứng.
     */
    @Transactional
    public Log logLogin(TaiKhoan taiKhoan, String ip, String location, String device) {
        if (taiKhoan == null) {
            return null;
        }

        NguoiDung nguoiDung = nguoiDungRepository.findByTaiKhoan_Id(taiKhoan.getId()).orElse(null);
        if (nguoiDung == null) {
            log.warn("Login log skipped: missing NguoiDung for taiKhoanId={}", taiKhoan.getId());
            return null;
        }

        LocalDateTime now = LocalDateTime.now();
        boolean abnormal = aiLogClient.isAbnormal(
                nguoiDung.getMaNguoiDung(), ip, now, location, device);

        Log logEntry = Log.builder()
                .maLog(IdGenerator.generate("LG"))
                .ip(ip)
                .time(now)
                .location(location)
                .device(device)
                .isAbnormal(abnormal)
                .nguoiDung(nguoiDung)
                .build();

        return logRepository.save(logEntry);
    }

    /**
     * Lịch sử đăng nhập của người dùng đang đăng nhập (theo TaiKhoan.id từ JWT).
     */
    public List<LogResponse> getLoginHistory(Long taiKhoanId) {
        if (taiKhoanId == null) {
            return Collections.emptyList();
        }
        NguoiDung nguoiDung = nguoiDungRepository.findByTaiKhoan_Id(taiKhoanId).orElse(null);
        if (nguoiDung == null) {
            return Collections.emptyList();
        }
        return logRepository
                .findByNguoiDung_MaNguoiDungOrderByTimeDesc(nguoiDung.getMaNguoiDung())
                .stream()
                .map(LogResponse::fromEntity)
                .toList();
    }
}
