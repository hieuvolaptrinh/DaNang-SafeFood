# TÀI LIỆU THIẾT KẾ DATABASE
## Hệ thống Quản lý An toàn Thực phẩm – FSMS Đà Nẵng

---

## I. MASTER TABLES

---

### Bảng: CO_SO

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã định danh cơ sở kinh doanh |
| TenCoSo | NVARCHAR(255) | NOT NULL | Tên cơ sở kinh doanh |
| ChuCoSo | NVARCHAR(255) | NULL | Họ tên chủ cơ sở / người đại diện pháp luật |
| DiaChi | NVARCHAR(MAX) | NOT NULL | Địa chỉ đầy đủ của cơ sở |
| SoDienThoai | VARCHAR(20) | NULL | Số điện thoại liên hệ |
| LoaiHinh | NVARCHAR(100) | NOT NULL | Loại hình kinh doanh (Nhà hàng, Quán ăn, Chế biến thực phẩm...) |
| QuanHuyen | NVARCHAR(100) | NOT NULL | Quận/Huyện nơi cơ sở hoạt động |
| SoGiayPhep | VARCHAR(50) | NULL | Số giấy phép kinh doanh hiện hành |
| NgayHetHanPhep | DATETIME | NULL | Ngày hết hạn giấy phép kinh doanh |
| TrangThai | VARCHAR(20) | NOT NULL, CHECK(TrangThai IN ('active','suspended','pending','expired')) | Trạng thái hoạt động của cơ sở |
| LanThanhTraGanNhat | DATETIME | NULL | Ngày thực hiện thanh tra gần nhất |

---

### Bảng: NGUOI_DUNG

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã định danh người dùng |
| HoTen | NVARCHAR(255) | NOT NULL | Họ và tên đầy đủ |
| Email | VARCHAR(255) | NOT NULL, UNIQUE | Email đăng nhập hệ thống |
| VaiTro | VARCHAR(20) | NOT NULL, CHECK(VaiTro IN ('ADMIN','AUTHORITY','INSPECTOR','TESTER','BUSINESS')) | Vai trò trong hệ thống |
| PhongBan | NVARCHAR(100) | NULL | Phòng ban / đơn vị công tác |
| TrangThaiTaiKhoan | VARCHAR(20) | NOT NULL, DEFAULT 'active', CHECK(TrangThaiTaiKhoan IN ('active','suspended')) | Trạng thái tài khoản |

---

### Bảng: TEP_DINH_KEM

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã định danh tệp đính kèm |
| LoaiEntity | VARCHAR(50) | NOT NULL, CHECK(LoaiEntity IN ('khieu_nai','giay_phep','bao_cao','ket_qua_kiem_nghiem')) | Loại đối tượng mà tệp thuộc về |
| EntityId | VARCHAR(50) | NOT NULL | Mã đối tượng tương ứng (FK đa hình) |
| TenTep | NVARCHAR(500) | NOT NULL | Tên tệp hiển thị trên giao diện |
| LoaiTep | VARCHAR(20) | NOT NULL, CHECK(LoaiTep IN ('image','file')) | Loại tệp: ảnh hoặc tài liệu |
| MoTa | NVARCHAR(MAX) | NULL | Ghi chú hoặc mô tả nội dung tệp |

---

### Bảng: DANH_MUC_TIEU_CHI_CHECKLIST

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã định danh tiêu chí |
| MaTieuChi | VARCHAR(50) | NOT NULL, UNIQUE | Mã kỹ thuật nội bộ (VD: cleanProcessingArea) |
| TenTieuChi | NVARCHAR(200) | NOT NULL | Tên tiêu chí hiển thị (VD: Khu chế biến sạch sẽ) |
| Nhom | NVARCHAR(100) | NOT NULL | Nhóm tiêu chí (VD: Nhóm 1: Cơ sở vật chất) |
| ThuTu | INT | NOT NULL, DEFAULT 0 | Thứ tự hiển thị trong nhóm |

---

## II. TRANSACTION TABLES

---

### Bảng: HO_SO_THANH_TRA

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã hồ sơ thanh tra |
| CoSoId | VARCHAR(50) | FK → CO_SO(Id), NOT NULL | Mã cơ sở được thanh tra |
| NguoiDungId | VARCHAR(50) | FK → NGUOI_DUNG(Id), NOT NULL | Mã thanh tra viên thực hiện |
| LoaiThanhTra | NVARCHAR(100) | NULL | Loại thanh tra (Định kỳ, Đột xuất, Theo phản ánh...) |
| ThoiGianKiemTra | DATETIME | NOT NULL | Ngày và giờ thực hiện kiểm tra |
| Ngay | DATETIME | NULL | Ngày thanh tra |
| KetQua | VARCHAR(20) | NOT NULL, CHECK(KetQua IN ('pass','fail','scheduled')) | Kết quả tổng thể: Đạt / Không đạt / Đã lên lịch |
| Diem | INT | NULL, CHECK(Diem BETWEEN 0 AND 100) | Điểm đánh giá tổng thể (thang 100) |
| GiayPhepKinhDoanh | NVARCHAR(50) | NULL | Tình trạng giấy phép kinh doanh tại thời điểm kiểm tra |
| GiayChungNhanAttp | NVARCHAR(50) | NULL | Tình trạng giấy chứng nhận an toàn thực phẩm |
| GiayKhamSucKhoe | NVARCHAR(50) | NULL | Tình trạng giấy khám sức khỏe nhân viên |
| GiayTapHuanAttp | NVARCHAR(50) | NULL | Tình trạng giấy tập huấn ATTP nhân viên |
| TinhTrangViPham | VARCHAR(10) | NULL, CHECK(TinhTrangViPham IN ('none','has')) | Cơ sở có vi phạm hay không |
| MoTaViPham | NVARCHAR(MAX) | NULL | Mô tả chi tiết nội dung vi phạm |
| KetLuan | VARCHAR(10) | NULL, CHECK(KetLuan IN ('pass','fail')) | Kết luận cuối: Đạt / Không đạt |
| NhanXetChung | NVARCHAR(MAX) | NULL | Nhận xét tổng quan của thanh tra viên |
| BienPhapXuLy | NVARCHAR(MAX) | NULL | Biện pháp xử lý được đề xuất |
| KienNghi | NVARCHAR(MAX) | NULL | Kiến nghị tiếp theo đối với cơ sở |

---

### Bảng: CHECKLIST_DANH_GIA

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã định danh kết quả đánh giá |
| HoSoId | VARCHAR(50) | FK → HO_SO_THANH_TRA(Id), NOT NULL | Mã hồ sơ thanh tra tương ứng |
| TieuChiId | VARCHAR(50) | FK → DANH_MUC_TIEU_CHI_CHECKLIST(Id), NOT NULL | Mã tiêu chí được đánh giá |
| KetQuaDanhGia | VARCHAR(10) | NOT NULL, CHECK(KetQuaDanhGia IN ('pass','fail')) | Kết quả đánh giá tiêu chí: Đạt / Không đạt |

---

### Bảng: NHIEM_VU_KIEM_TRA

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã nhiệm vụ kiểm tra |
| CoSoId | VARCHAR(50) | FK → CO_SO(Id), NOT NULL | Mã cơ sở cần kiểm tra |
| NguoiDuocGiaoId | VARCHAR(50) | FK → NGUOI_DUNG(Id), NULL | Mã thanh tra viên được phân công |
| ThoiGianKiemTra | NVARCHAR(100) | NOT NULL | Thời gian dự kiến kiểm tra |
| NoiDungKiemTra | NVARCHAR(MAX) | NOT NULL | Nội dung và phạm vi cần kiểm tra |
| TrangThaiNhan | VARCHAR(20) | NOT NULL, DEFAULT 'pending', CHECK(TrangThaiNhan IN ('pending','accepted')) | Trạng thái nhận nhiệm vụ: Chưa nhận / Đã nhận |
| TrangThaiTienDo | VARCHAR(20) | NOT NULL, DEFAULT 'idle', CHECK(TrangThaiTienDo IN ('idle','in-progress','completed')) | Tiến độ: Chưa bắt đầu / Đang kiểm tra / Hoàn thành |
| GhiChu | NVARCHAR(MAX) | NULL | Ghi chú cập nhật tiến độ |

---

### Bảng: MAU_KIEM_NGHIEM

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã mẫu kiểm nghiệm (VD: M-2025-001) |
| CoSoId | VARCHAR(50) | FK → CO_SO(Id), NULL | Mã cơ sở nơi thu thập mẫu |
| TenMau | NVARCHAR(255) | NOT NULL | Tên mô tả mẫu (VD: Mẫu hải sản tươi sống) |
| NgayLayMau | DATETIME | NOT NULL | Ngày thu thập mẫu tại cơ sở |

---

### Bảng: YEU_CAU_KIEM_NGHIEM

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã yêu cầu kiểm nghiệm (VD: YC-2025001) |
| CoSoId | VARCHAR(50) | FK → CO_SO(Id), NOT NULL | Mã cơ sở liên quan đến yêu cầu |
| MauId | VARCHAR(50) | FK → MAU_KIEM_NGHIEM(Id), NOT NULL | Mã mẫu gửi kiểm nghiệm |
| NguoiTaoId | VARCHAR(50) | FK → NGUOI_DUNG(Id), NULL | Mã thanh tra viên tạo yêu cầu |
| LoaiMau | NVARCHAR(255) | NULL | Loại mẫu (VD: Mẫu thực phẩm tươi) |
| NgayYeuCau | DATETIME | NOT NULL | Ngày tạo yêu cầu kiểm nghiệm |
| HanHoanThanh | DATETIME | NULL | Hạn chót hoàn thành kết quả |
| TrangThai | VARCHAR(20) | NOT NULL, DEFAULT 'pending', CHECK(TrangThai IN ('pending','processing','completed')) | Trạng thái: Chờ xử lý / Đang thực hiện / Hoàn thành |
| CoQuanKiemDinh | NVARCHAR(255) | NOT NULL | Tên cơ quan / phòng lab thực hiện kiểm định |
| NoiDungYeuCau | NVARCHAR(MAX) | NULL | Mô tả chi tiết nội dung và mục tiêu kiểm định |

---

### Bảng: CHI_TIEU_KIEM_DINH

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã định danh chỉ tiêu được chọn |
| YeuCauId | VARCHAR(50) | FK → YEU_CAU_KIEM_NGHIEM(Id), NOT NULL | Mã yêu cầu kiểm nghiệm tương ứng |
| TenChiTieu | NVARCHAR(100) | NOT NULL | Tên chỉ tiêu (Vi sinh / Hóa học / Kim loại nặng / Cảm quan / Khác) |
| MoTaKhac | NVARCHAR(500) | NULL | Mô tả bổ sung khi chọn chỉ tiêu "Khác" |

---

### Bảng: KET_QUA_KIEM_NGHIEM

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã phiếu kết quả kiểm nghiệm (VD: KN-2025001) |
| YeuCauId | VARCHAR(50) | FK → YEU_CAU_KIEM_NGHIEM(Id), NOT NULL | Mã yêu cầu kiểm nghiệm tương ứng |
| CoSoId | VARCHAR(50) | FK → CO_SO(Id), NOT NULL | Mã cơ sở có mẫu được kiểm nghiệm |
| TenMau | NVARCHAR(255) | NOT NULL | Tên mẫu kiểm nghiệm (VD: Mẫu nước rửa khu sơ chế) |
| LoaiMau | NVARCHAR(255) | NULL | Loại mẫu (VD: Mẫu nước rửa) |
| NgayKiemNghiem | DATETIME | NOT NULL | Ngày thực hiện kiểm nghiệm tại phòng lab |
| PhongLab | NVARCHAR(255) | NOT NULL | Tên phòng lab thực hiện |
| KetLuan | VARCHAR(20) | NOT NULL, CHECK(KetLuan IN ('pass','fail')) | Kết luận tổng thể: Đạt / Không đạt |
| Diem | INT | NULL, CHECK(Diem BETWEEN 0 AND 100) | Điểm kết quả kiểm nghiệm (thang 100) |
| TenFileKetQua | NVARCHAR(500) | NULL | Tên tệp PDF kết quả có dấu mộc của phòng lab |

---

### Bảng: CHI_TIET_KET_QUA_TIEU_CHI

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã định danh dòng kết quả chỉ tiêu |
| KetQuaId | VARCHAR(50) | FK → KET_QUA_KIEM_NGHIEM(Id), NOT NULL | Mã phiếu kết quả kiểm nghiệm |
| TenChiTieu | NVARCHAR(255) | NOT NULL | Tên chỉ tiêu đo lường (VD: Coliform, E.coli) |
| GiaTriDo | NVARCHAR(255) | NULL | Giá trị đo được từ phòng lab (VD: 1 CFU/100ml) |
| GioiHanChoPhep | NVARCHAR(255) | NULL | Ngưỡng giới hạn cho phép theo quy chuẩn (VD: <= 3 CFU/100ml) |
| KetLuan | VARCHAR(10) | NOT NULL, CHECK(KetLuan IN ('pass','fail')) | Kết luận riêng cho chỉ tiêu: Đạt / Không đạt |

---

### Bảng: BAO_CAO_THANH_TRA

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã báo cáo thanh tra |
| CoSoId | VARCHAR(50) | FK → CO_SO(Id), NOT NULL | Mã cơ sở được ghi nhận trong báo cáo |
| NguoiDungId | VARCHAR(50) | FK → NGUOI_DUNG(Id), NOT NULL | Mã thanh tra viên lập báo cáo |
| LoaiThanhTra | NVARCHAR(100) | NULL | Loại cuộc thanh tra |
| Ngay | DATETIME | NOT NULL | Ngày lập báo cáo |
| KetQua | VARCHAR(20) | NOT NULL, CHECK(KetQua IN ('pass','fail','scheduled')) | Kết quả: Đạt / Không đạt / Đã lên lịch |
| Diem | INT | NULL, CHECK(Diem BETWEEN 0 AND 100) | Điểm đánh giá (thang 100) |
| NoiDung | NVARCHAR(MAX) | NULL | Nội dung chi tiết đã kiểm tra |
| NhanXet | NVARCHAR(MAX) | NULL | Nhận xét tổng kết |
| TenTepDinhKem | NVARCHAR(500) | NULL | Tên tệp báo cáo đính kèm (PDF) |

---

### Bảng: KHIEU_NAI

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã khiếu nại |
| TieuDe | NVARCHAR(500) | NOT NULL | Tiêu đề tóm tắt nội dung khiếu nại |
| NguoiGui | NVARCHAR(255) | NOT NULL | Tên người gửi khiếu nại |
| NgayGui | DATETIME | NOT NULL | Ngày gửi khiếu nại |
| TrangThai | VARCHAR(20) | NOT NULL, DEFAULT 'pending', CHECK(TrangThai IN ('pending','processing','resolved')) | Trạng thái: Chờ / Đang xử lý / Đã giải quyết |
| NoiDung | NVARCHAR(MAX) | NOT NULL | Nội dung chi tiết khiếu nại |
| TomTatKiemTraThucDia | NVARCHAR(MAX) | NULL | Tóm tắt kết quả kiểm tra thực địa |
| KetQuaXuLy | NVARCHAR(MAX) | NULL | Kết quả và biện pháp xử lý đã thực hiện |
| HoTenNguoiGui | NVARCHAR(255) | NULL | Họ tên đầy đủ người gửi khiếu nại |
| SoDienThoaiNguoiGui | VARCHAR(20) | NULL | Số điện thoại người gửi |
| EmailNguoiGui | VARCHAR(255) | NULL | Địa chỉ email người gửi |
| DiaChiNguoiGui | NVARCHAR(MAX) | NULL | Địa chỉ thường trú người gửi |

---

### Bảng: GIAY_PHEP

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| Id | VARCHAR(50) | PK, NOT NULL | Mã giấy phép (VD: GP-2025001) |
| CoSoId | VARCHAR(50) | FK → CO_SO(Id), NOT NULL | Mã cơ sở được cấp phép |
| LoaiGiayPhep | NVARCHAR(200) | NOT NULL | Loại giấy phép (VD: Giấy phép kinh doanh thực phẩm) |
| NgayCap | DATETIME | NOT NULL | Ngày cơ quan có thẩm quyền cấp giấy phép |
| NgayHetHan | DATETIME | NOT NULL | Ngày giấy phép hết hiệu lực |
| TrangThai | VARCHAR(20) | NOT NULL, CHECK(TrangThai IN ('valid','expired','revoked')) | Trạng thái: Còn hiệu lực / Hết hạn / Đã thu hồi |

---

## III. BẢNG QUAN HỆ (Relationship Summary)

| Bảng con | Trường khóa ngoại | Bảng cha | Trường tham chiếu |
|---|---|---|---|
| HO_SO_THANH_TRA | CoSoId | CO_SO | Id |
| HO_SO_THANH_TRA | NguoiDungId | NGUOI_DUNG | Id |
| CHECKLIST_DANH_GIA | HoSoId | HO_SO_THANH_TRA | Id |
| CHECKLIST_DANH_GIA | TieuChiId | DANH_MUC_TIEU_CHI_CHECKLIST | Id |
| NHIEM_VU_KIEM_TRA | CoSoId | CO_SO | Id |
| NHIEM_VU_KIEM_TRA | NguoiDuocGiaoId | NGUOI_DUNG | Id |
| MAU_KIEM_NGHIEM | CoSoId | CO_SO | Id |
| YEU_CAU_KIEM_NGHIEM | CoSoId | CO_SO | Id |
| YEU_CAU_KIEM_NGHIEM | MauId | MAU_KIEM_NGHIEM | Id |
| YEU_CAU_KIEM_NGHIEM | NguoiTaoId | NGUOI_DUNG | Id |
| CHI_TIEU_KIEM_DINH | YeuCauId | YEU_CAU_KIEM_NGHIEM | Id |
| KET_QUA_KIEM_NGHIEM | YeuCauId | YEU_CAU_KIEM_NGHIEM | Id |
| KET_QUA_KIEM_NGHIEM | CoSoId | CO_SO | Id |
| CHI_TIET_KET_QUA_TIEU_CHI | KetQuaId | KET_QUA_KIEM_NGHIEM | Id |
| BAO_CAO_THANH_TRA | CoSoId | CO_SO | Id |
| BAO_CAO_THANH_TRA | NguoiDungId | NGUOI_DUNG | Id |
| GIAY_PHEP | CoSoId | CO_SO | Id |
| TEP_DINH_KEM | EntityId | KHIEU_NAI / GIAY_PHEP / BAO_CAO / KET_QUA | Id (đa hình) |
