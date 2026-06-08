'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { baoCaoApi, type BaoCaoResponse } from '@/api/api';
import { PageHeader, SectionCard, StatusBadge, GovBtn, ActionButtons, FormLayout, FormSection, FormField } from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

function normalizeError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function BaoCaoChinhSuaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const [report, setReport] = useState<BaoCaoResponse | null>(null);
  const [content, setContent] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await baoCaoApi.getById(id);
        if (!isMounted) {
          return;
        }

        setReport(data);
        setContent(data.noiDung ?? '');
        setComment(data.nhanXet ?? '');
      } catch (error) {
        if (isMounted) {
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

  const isFormValid = content.trim().length > 0 && comment.trim().length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!report || !isFormValid || isSubmitting) return;
    if (!report.facilityId) {
      setErrorMessage('Không xác định được cơ sở gốc của báo cáo để cập nhật');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await baoCaoApi.update(id, {
        facilityId: report.facilityId,
        inspectionDate: report.ngay,
        inspectionType: report.loaiThanhTra,
        content: content.trim(),
        comment: comment.trim(),
        result: report.ketQua,
        score: report.diem,
        fileName: report.tepDinhKem,
        hasInspectionRecord: true,
      });
      router.push(`/thanh-tra-kiem-dinh/bao-cao?updated=${encodeURIComponent(id)}`);
    } catch (error) {
      setErrorMessage(normalizeError(error, 'Không thể cập nhật báo cáo lúc này'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Đang tải báo cáo"
          subtitle="Đang lấy dữ liệu để chỉnh sửa"
        />
        <SectionCard title="Chỉnh sửa báo cáo">
          <p style={{ padding: '12px', fontSize: '13px', color: '#555' }}>Đang tải dữ liệu...</p>
        </SectionCard>
      </div>
    );
  }

  if (!report) {
    return (
      <div>
        <AlertBanner type="danger" title={errorMessage || `Không tìm thấy báo cáo ${id}`} />
        <GovBtn variant="secondary" onClick={() => router.push('/thanh-tra-kiem-dinh/bao-cao')}>
          ← Quay lại danh sách
        </GovBtn>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Chỉnh sửa báo cáo — ${report.id}`}
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Cập nhật nội dung báo cáo thanh tra"
        actions={
          <ActionButtons>
            <GovBtn
              variant="secondary"
              onClick={() => router.push(`/thanh-tra-kiem-dinh/bao-cao/${report.id}`)}
              disabled={isSubmitting}
            >
              ← Hủy
            </GovBtn>
          </ActionButtons>
        }
      />

      {errorMessage && <AlertBanner type="danger" title={errorMessage} />}

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

      <SectionCard title="Thông tin báo cáo (chỉ đọc)">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              { label: 'Tên cơ sở', value: report.tenCoSo },
              { label: 'Loại hình thanh tra', value: report.loaiThanhTra },
              { label: 'Kết quả', value: <StatusBadge variant={report.ketQua} /> },
              { label: 'Điểm', value: report.diem > 0 ? `${report.diem} / 100` : 'Chưa có' },
            ].map((row, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #F0F0F0' }}>
                <td style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 600, color: '#555', width: '200px', background: '#FAFAFA', whiteSpace: 'nowrap' }}>
                  {row.label}
                </td>
                <td style={{ padding: '8px 12px', fontSize: '13px', color: '#222' }}>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <form onSubmit={handleSubmit}>
        <FormLayout>
          <FormSection title="Nội dung có thể chỉnh sửa">
            <FormField label="Nội dung báo cáo" required fullWidth>
              <textarea
                id="edit-content"
                rows={6}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  border: '1px solid #D6D6D6',
                  borderRadius: '2px',
                  padding: '8px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  color: '#222',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </FormField>

            <FormField label="Nhận xét & Kiến nghị" required fullWidth>
              <textarea
                id="edit-comment"
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  border: '1px solid #D6D6D6',
                  borderRadius: '2px',
                  padding: '8px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  color: '#222',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </FormField>
          </FormSection>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #D6D6D6' }}>
            <GovBtn
              variant="secondary"
              type="button"
              onClick={() => router.push(`/thanh-tra-kiem-dinh/bao-cao/${report.id}`)}
              disabled={isSubmitting}
            >
              Hủy bỏ
            </GovBtn>
            <GovBtn
              variant="primary"
              type="submit"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </GovBtn>
          </div>
        </FormLayout>
      </form>
    </div>
  );
}
