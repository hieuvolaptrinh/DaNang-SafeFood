'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { baoCaoApi, type BaoCaoResponse } from '@/api/api';
import AlertBanner from '@/components/AlertBanner';
import { PageHeader, SectionCard, StatusBadge, GovBtn, ActionButtons } from '@/components/GovUI';

function normalizeError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function BaoCaoChiTietPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [report, setReport] = useState<BaoCaoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await baoCaoApi.getById(id);
        if (isMounted) {
          setReport(data);
        }
      } catch (error) {
        if (isMounted) {
          setReport(null);
          setErrorMessage(normalizeError(error, `Không tìm thấy báo cáo ${id}`));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Đang tải báo cáo"
          subtitle="Đang lấy dữ liệu chi tiết báo cáo thanh tra"
        />
        <SectionCard title="Chi tiết báo cáo">
          <p style={{ padding: '12px', fontSize: '13px', color: '#555' }}>Đang tải dữ liệu...</p>
        </SectionCard>
      </div>
    );
  }

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
        {errorMessage && <AlertBanner type="danger" title={errorMessage} />}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Chi tiết báo cáo thanh tra — ${report.id}`}
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Xem chi tiết báo cáo kết quả thanh tra"
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
              color: (report.diem ?? 0) >= 80 ? '#006400' : (report.diem ?? 0) >= 60 ? '#CC6600' : '#CC0000',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {report.diem ?? '—'}
            </span>
            <span style={{ fontSize: '12px', color: '#555' }}>
              {report.diem ? `/ 100 điểm` : 'Chưa có điểm đánh giá'}
            </span>
          </div>
        </SectionCard>
      </div>

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
            ].map((row, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #F0F0F0' }}>
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
    </div>
  );
}
