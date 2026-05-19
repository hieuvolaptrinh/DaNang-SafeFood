import Link from 'next/link';
import { mockInspectionReports } from '@/data/mockData';
import { PageHeader, SectionCard, StatusBadge, GovBtn, ActionButtons } from '@/components/GovUI';

export default async function BaoCaoChiTietPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = mockInspectionReports.find((item) => item.id === id);

  if (!report) {
    return (
      <div>
        <PageHeader
          title="Không tìm thấy báo cáo"
          subtitle={`Báo cáo mã ${id} không tồn tại trong hệ thống`}
          actions={
            <Link href="/thanh-tra-kiem-dinh/bao-cao">
              <GovBtn variant="secondary">← Quay lại danh sách</GovBtn>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Chi tiết báo cáo thanh tra — ${report.id}`}
        subtitle={`Chi cục An toàn Thực phẩm TP. Đà Nẵng — Xem chi tiết báo cáo kết quả thanh tra`}
        actions={
          <ActionButtons>
            <Link href="/thanh-tra-kiem-dinh/bao-cao">
              <GovBtn variant="secondary">← Quay lại</GovBtn>
            </Link>
            <Link href={`/thanh-tra-kiem-dinh/bao-cao/${report.id}/edit`}>
              <GovBtn variant="primary">Chỉnh sửa</GovBtn>
            </Link>
          </ActionButtons>
        }
      />

      {/* Thông tin tổng quan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        {[
          { label: 'Mã báo cáo', value: report.id, mono: true },
          { label: 'Ngày kiểm tra', value: report.ngay, mono: true },
          { label: 'Quận/Huyện', value: report.quanHuyen },
          { label: 'Thanh tra viên', value: report.thanhTraVien },
        ].map((item) => (
          <div key={item.label} style={{ background: '#fff', border: '1px solid #D6D6D6', borderRadius: '1px', padding: '10px 14px' }}>
            <p style={{ fontSize: '10.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '4px' }}>
              {item.label}
            </p>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#222', fontFamily: item.mono ? 'monospace' : 'inherit' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Kết quả và điểm */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <SectionCard title="Kết quả thanh tra">
          <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StatusBadge variant={report.ketQua} />
            <span style={{ fontSize: '12px', color: '#555' }}>
              {report.ketQua === 'pass' ? 'Cơ sở đáp ứng yêu cầu an toàn thực phẩm.' :
               report.ketQua === 'fail' ? 'Cơ sở chưa đáp ứng yêu cầu, cần khắc phục.' :
               'Đã lên lịch kiểm tra, chờ kết quả.'}
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Điểm đánh giá">
          <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '28px',
              fontWeight: 700,
              color: report.diem >= 80 ? '#006400' : report.diem >= 60 ? '#CC6600' : '#CC0000',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {report.diem > 0 ? report.diem : '—'}
            </span>
            <span style={{ fontSize: '12px', color: '#555' }}>
              {report.diem > 0 ? `/ 100 điểm` : 'Chưa có điểm đánh giá'}
            </span>
          </div>
        </SectionCard>
      </div>

      {/* Nội dung chi tiết */}
      <SectionCard title="Nội dung báo cáo thanh tra">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              { label: 'Cơ sở được kiểm tra', value: report.tenCoSo, bold: true },
              { label: 'Loại hình thanh tra', value: report.loaiThanhTra },
              { label: 'Ngày tiến hành', value: report.ngay, mono: true },
              { label: 'Quận/Huyện', value: report.quanHuyen },
              { label: 'Thanh tra viên', value: report.thanhTraVien },
              { label: 'Tệp đính kèm', value: report.tepDinhKem || 'Không có tệp đính kèm' },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F0F0F0' }}>
                <td style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 600, color: '#555', width: '200px', background: '#FAFAFA', whiteSpace: 'nowrap' }}>
                  {row.label}
                </td>
                <td style={{ padding: '8px 12px', fontSize: '13px', color: '#222', fontWeight: row.bold ? 600 : 400, fontFamily: row.mono ? 'monospace' : 'inherit' }}>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ padding: '10px 12px', borderTop: '2px solid #EAF7EA' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Nội dung kiểm tra
          </p>
          <p style={{ fontSize: '13px', color: '#333', lineHeight: 1.7, background: '#F5F5F5', padding: '10px', border: '1px solid #D6D6D6', borderRadius: '2px' }}>
            {report.noiDung}
          </p>
        </div>

        <div style={{ padding: '10px 12px', borderTop: '1px solid #F0F0F0' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Nhận xét & Kiến nghị
          </p>
          <p style={{ fontSize: '13px', color: '#333', lineHeight: 1.7, background: '#F5F5F5', padding: '10px', border: '1px solid #D6D6D6', borderRadius: '2px' }}>
            {report.nhanXet}
          </p>
        </div>
      </SectionCard>

      <p style={{ fontSize: '11.5px', color: '#888', textAlign: 'center', marginTop: '8px' }}>
        Báo cáo thanh tra được lưu trữ theo Quy chế lưu trữ hồ sơ ATTP — Chi cục An toàn Thực phẩm TP. Đà Nẵng
      </p>
    </div>
  );
}
