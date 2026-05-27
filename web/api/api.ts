/**
 * @deprecated Import trực tiếp từ module tương ứng:
 *   '@/api/client', '@/api/thongke', '@/api/cosokinhdoanh',
 *   '@/api/giaychungnhan', '@/api/thanhtra',
 *   '@/api/yeucaukiemnghiem', '@/api/ketquakiemnghiem'
 *
 * File này chỉ giữ lại để tương thích ngược — không thêm code mới vào đây.
 */

// Core client
export { api, type ApiResponse, type FetchOptions } from './client';
export { default } from './client';

// Thống kê
export {
  thongKeApi,
  type DashboardSummary,
  type GiayPhepSapHetHan,
  type ThongKeQuanHuyen,
  type ViPhamGanDay,
  type ViPhamTheoThang,
} from './thongke';

// Cơ sở kinh doanh
export {
  coSoKinhDoanhApi,
  type CoSoKinhDoanhItem,
  type CoSoKinhDoanhPageResponse,
  type GiayChungNhanItem,
} from './cosokinhdoanh';

// Giấy chứng nhận
export {
  giayChungNhanApi,
  type GiayChungNhanPageResponse,
  type CreateGiayChungNhanRequest,
} from './giaychungnhan';

// Thanh tra
export {
  thanhTraApi,
  type ThanhTraItem,
  type ThanhTraPageResponse,
  type CanBoThanhTraItem,
  type CreateThanhTraRequest,
} from './thanhtra';

// Ho so thanh tra
export {
  hoSoThanhTraApi,
  type HoSoThanhTraResponse,
  type HoSoThanhTraStatsResponse,
  type HoSoThanhTraRequest,
} from './hosothanhtra';

// Yêu cầu kiểm nghiệm
export {
  yeuCauKiemNghiemApi,
  type YeuCauKiemNghiemResponse,
  type CreateYeuCauKiemNghiemRequest,
  type UpdateKetQuaKiemNghiemRequest,
  type YeuCauKiemNghiemStatsResponse,
} from './yeucaukiemnghiem';

// Kết quả kiểm nghiệm
export {
  ketQuaKiemNghiemApi,
  type KetQuaKiemNghiemStatsResponse,
  type KetQuaKiemNghiemChiTieuResponse,
  type KetQuaKiemNghiemItemResponse,
  type KetQuaKiemNghiemDetailResponse,
} from './ketquakiemnghiem';

// Vi phạm
export {
  viPhamApi,
  type ViPhamItem,
  type ViPhamPageResponse,
  type TrangThaiPheDuyet,
} from './vipham';

// Nhiệm vụ
export {
  nhiemVuApi,
  type NhiemVuStatsResponse,
  type NhiemVuListItemResponse,
  type NhiemVuDetailResponse,
} from './nhiemvu';

// Khiếu nại
export {
  khieuNaiApi,
  type KhieuNaiSummaryResponse,
  type KhieuNaiDetailResponse,
} from './khieunai';

// Báo cáo thanh tra
export {
  baoCaoApi,
  type BaoCaoResponse,
  type BaoCaoStatsResponse,
  type CreateBaoCaoRequest,
} from './baocao';

// Tiêu chí đánh giá
export {
  tieuChiDanhGiaApi,
  type TieuChiDanhGiaResponse,
  type CreateTieuChiRequest,
} from './tieuchi';
