package com.danang.safefood.repository;

import com.danang.safefood.entity.QuyenHanNguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuyenHanNguoiDungRepository
        extends JpaRepository<QuyenHanNguoiDung, QuyenHanNguoiDung.QuyenHanNguoiDungId> {
}
