package com.danang.safefood.service;

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

@Service
@RequiredArgsConstructor
@Slf4j
public class LogService {

    private final LogRepository logRepository;
    private final NguoiDungRepository nguoiDungRepository;

    @Transactional
    public void logLogin(TaiKhoan taiKhoan, String ip, String location, String device) {
        if (taiKhoan == null) {
            return;
        }

        NguoiDung nguoiDung = nguoiDungRepository.findByTaiKhoan_Id(taiKhoan.getId()).orElse(null);
        if (nguoiDung == null) {
            log.warn("Login log skipped: missing NguoiDung for taiKhoanId={}", taiKhoan.getId());
            return;
        }

        Log logEntry = Log.builder()
                .maLog(IdGenerator.generate("LG"))
                .ip(ip)
                .time(LocalDateTime.now())
                .location(location)
                .device(device)
                .nguoiDung(nguoiDung)
                .build();

        logRepository.save(logEntry);
    }
}
