//package com.danang.safefood.repository;
//
//import com.danang.safefood.entity.QuyenHan;
//import com.danang.safefood.entity.QuyenHanNguoiDung;
//import com.danang.safefood.entity.TaiKhoan;
//import com.danang.safefood.repository.TaiKhoanRepository;
//import lombok.RequiredArgsConstructor;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.context.annotation.Import;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.test.context.ActiveProfiles;
//
//import java.util.Optional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//
//@ActiveProfiles("test")
//@Import(BCryptPasswordEncoder.class)
//@RequiredArgsConstructor
//class TaiKhoanTest {
//
//
//    private final PasswordEncoder passwordEncoder;
//
//    private  PasswordEncoder testPasswordEncoder;
//
////    @BeforeEach
////    void setUp() {
////        this.testPasswordEncoder = new BCryptPasswordEncoder(12);
////    }
////
////    @Test
////    @DisplayName("Thêm mới Kiểm định viên thành công")
////    void themKiemDinhVien() {
////
////        // 2. Tạo tài khoản Kiểm định viên
////        String rawPassword = "123456";
////
////        TaiKhoan kiemDinhVien = TaiKhoan.builder()
////                .username("kiemdinhvien2")
////                .password(testPasswordEncoder.encode(rawPassword))
////                .fullName("Lê Văn Kiểm Định")
////                .email("kiemdinh2@safefood.vn")
////                .phone("0933456789")
////                .enabled(true)
////                .build();
////
////        TaiKhoan saved = taiKhoanRepository.save(kiemDinhVien);
////
////        // 3. Gán quyền cho tài khoản
////        QuyenHanNguoiDung phanQuyen = QuyenHanNguoiDung.builder()
////                .maQuyenHan()
////                .taiKhoanId(saved.getId())
////                .build();
////
////        quyenHanNguoiDungRepository.save(phanQuyen);
////
////        // 4. Kiểm tra kết quả
////        Optional<TaiKhoan> found = taiKhoanRepository.findByUsername("kiemdinhvien2");
////
////        assertThat(found).isPresent();
////        assertThat(found.get().getFullName()).isEqualTo("Lê Văn Kiểm Định");
////        assertThat(found.get().getUsername()).isEqualTo("kiemdinhvien2");
////        assertThat(passwordEncoder.matches(rawPassword, found.get().getPassword()))
////                .as("Mật khẩu phải khớp sau khi encode")
////                .isTrue();
//
//        System.out.println("✅ Thêm Kiểm định viên thành công!");
//        System.out.println("   Username : " + saved.getUsername());
//        System.out.println("   Full Name: " + saved.getFullName());
//        System.out.println("   Email    : " + saved.getEmail());
//    }
//}