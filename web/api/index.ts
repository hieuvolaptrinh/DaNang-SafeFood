/**
 * API barrel — import từ đây thay vì import riêng từng file.
 *
 * Ví dụ:
 *   import { thongKeApi, coSoKinhDoanhApi } from "@/api";
 *   import type { DashboardSummary } from "@/api";
 */

// Core HTTP client
export { api, type ApiResponse, type FetchOptions } from "./client";

// Domain APIs
export {
  thongKeApi,
  type DashboardSummary,
  type GiayPhepSapHetHan,
  type ThongKeQuanHuyen,
  type ViPhamGanDay,
  type ViPhamTheoThang,
} from "./thongke";

export {
  coSoKinhDoanhApi,
  type CoSoKinhDoanhItem,
  type CoSoKinhDoanhPageResponse,
  type GiayChungNhanItem,
} from "./cosokinhdoanh";

export {
  giayChungNhanApi,
  type GiayChungNhanPageResponse,
  type CreateGiayChungNhanRequest,
} from "./giaychungnhan";

export {
  thanhTraApi,
  type ThanhTraItem,
  type ThanhTraPageResponse,
  type CanBoThanhTraItem,
  type CreateThanhTraRequest,
} from "./thanhtra";

export {
  yeuCauKiemNghiemApi,
  type YeuCauKiemNghiemResponse,
  type CreateYeuCauKiemNghiemRequest,
  type UpdateKetQuaKiemNghiemRequest,
  type YeuCauKiemNghiemStatsResponse,
} from "./yeucaukiemnghiem";

export {
  ketQuaKiemNghiemApi,
  type KetQuaKiemNghiemStatsResponse,
  type KetQuaKiemNghiemChiTieuResponse,
  type KetQuaKiemNghiemItemResponse,
  type KetQuaKiemNghiemDetailResponse,
} from "./ketquakiemnghiem";

export {
  phanAnhApi,
  type PhanAnhItem,
  type PhanAnhPageResponse,
  type UpdatePhanAnhRequest,
  type TrangThaiPhanAnh,
} from "./phananh";

export {
  khacPhucApi,
  type KhacPhucItem,
  type KhacPhucPageResponse,
  type TinhTrangKhacPhuc,
} from "./khacphuc";

export {
  thongBaoApi,
  type ThongBaoItem,
  type ThongBaoPageResponse,
  type CreateThongBaoRequest,
} from "./thongbao";

export {
  quyDinhApi,
  type QuyDinhItem,
  type QuyDinhPageResponse,
  type CreateQuyDinhRequest,
  type LoaiQuyDinh,
  type TrangThaiQuyDinh,
} from "./quidinh";

export {
  mauKiemNghiemApi,
  type MauKiemNghiemItem,
  type MauKiemNghiemPageResponse,
  type MauKiemNghiemSelectOption,
  type MauChiTieuItem,
  type SaveMauChiTieuRequest,
  type DanhMucChiTieuItem,
} from "./maukiemnghiem";

export {
  viPhamApi,
  type ViPhamItem,
  type ViPhamPageResponse,
  type TrangThaiPheDuyet,
  type CreateViPhamRequest,
  type DanhMucLoaiViPhamItem,
} from "./vipham";
