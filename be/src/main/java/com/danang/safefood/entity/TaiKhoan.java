package com.danang.safefood.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "tai_khoan", uniqueConstraints = {
        @UniqueConstraint(name = "uq_tai_khoan_username", columnNames = "username"),
        @UniqueConstraint(name = "uq_tai_khoan_email", columnNames = "email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaiKhoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", length = 100, nullable = false)
    private String username;

    @Column(name = "password", length = 255, nullable = false)
    private String password;

    @Column(name = "fullName", length = 150)
    private String fullName;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    // @Enumerated(EnumType.STRING)
    // @Column(name = "role", length = 30, nullable = false)
    // @Builder.Default
    // private Role role = Role.NGUOI_TIEU_DUNG;

    @OneToMany(mappedBy = "taiKhoan", fetch = FetchType.LAZY)
    private List<QuyenHanNguoiDung> quyenHanNguoiDungList;

    @Column(name = "enabled", nullable = false)
    @Builder.Default
    private boolean enabled = true;

    @Column(name = "createdAt", nullable = false, updatable = true)
    private Instant createdAt;

    @Column(name = "updatedAt", nullable = true)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        var now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
