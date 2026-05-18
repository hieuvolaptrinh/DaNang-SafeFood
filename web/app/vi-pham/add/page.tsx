
'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import {
  PageHeader,
  GovBtn,
  SectionCard,
  GovInput,
  GovSelect,
  FilterField,
} from '@/components/GovUI';

import AlertBanner from '@/components/AlertBanner';

interface MauKiemNghiem {
  id: string;
  businessName: string;
  sampleType: string;
  collectedDate: string;
  result?: 'pass' | 'fail';
  inspectionId: string;
}

const mockMau: MauKiemNghiem[] = [
  {
    id: 'MKN-2025001',
    businessName: 'Nhà hàng Phở Ba Miền',
    sampleType: 'Nước uống',
    collectedDate: '10/01/2025',
    result: 'pass',
    inspectionId: 'INS-2847',
  },
  {
    id: 'MKN-2025002',
    businessName: 'Công ty Hải Sản Đà Nẵng',
    sampleType: 'Hải sản tươi sống',
    collectedDate: '09/01/2025',
    result: 'fail',
    inspectionId: 'INS-2846',
  },
  {
    id: 'MKN-2025003',
    businessName: 'Chợ Tươi Đà Nẵng',
    sampleType: 'Rau củ quả',
    collectedDate: '08/01/2025',
    result: 'pass',
    inspectionId: 'INS-2845',
  },
  {
    id: 'MKN-2025004',
    businessName: 'Bánh Mì Hội An',
    sampleType: 'Bột mì & phụ gia',
    collectedDate: '20/12/2024',
    result: 'fail',
    inspectionId: 'INS-2842',
  },
];

export default function ThemMoiViPhamPage() {
  const failedSamples = useMemo(
    () => mockMau.filter(m => m.result === 'fail'),
    []
  );

  const [selectedSample, setSelectedSample] = useState('');
  const [violationType, setViolationType] = useState('');
  const [severity, setSeverity] = useState('');
  const [penalty, setPenalty] = useState('');
  const [description, setDescription] = useState('');

  const selectedData = failedSamples.find(
    s => s.id === selectedSample
  );

  return (
    <div>
      <PageHeader
        title="Thêm mới vi phạm"
        subtitle="Tạo hồ sơ vi phạm từ các mẫu kiểm nghiệm không đạt yêu cầu"
        actions={
          <Link href="/vi-pham">
            <GovBtn variant="secondary">
              <ArrowLeft style={{ width: 14, height: 14 }} />
              Quay lại
            </GovBtn>
          </Link>
        }
      />

      <AlertBanner
        type="warning"
        title="Chỉ các mẫu kiểm nghiệm có kết quả KHÔNG ĐẠT mới được phép lập hồ sơ vi phạm."
      />

      <SectionCard title="Thông tin mẫu kiểm nghiệm">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}
        >
          <FilterField label="Chọn mẫu kiểm nghiệm không đạt">
            <GovSelect
              value={selectedSample}
              onChange={setSelectedSample}
              options={[
                { value: '', label: '-- Chọn mẫu --' },
                ...failedSamples.map(m => ({
                  value: m.id,
                  label: `${m.id} - ${m.businessName}`,
                })),
              ]}
              width="100%"
            />
          </FilterField>

          <FilterField label="Loại mẫu">
            <GovInput
              value={selectedData?.sampleType || ''}
              required
              placeholder="Tự động hiển thị"
            />
          </FilterField>

          <FilterField label="Cơ sở vi phạm">
            <GovInput
              value={selectedData?.businessName || ''}
              required
              placeholder="Tự động hiển thị"
            />
          </FilterField>

          <FilterField label="Mã thanh tra">
            <GovInput
              value={selectedData?.inspectionId || ''}
              required
              placeholder="Tự động hiển thị"
            />
          </FilterField>
        </div>
      </SectionCard>

      <div style={{ height: 16 }} />

      <SectionCard title="Thông tin vi phạm">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}
        >
          <FilterField label="Loại vi phạm">
            <GovInput
              value={violationType}
              onChange={setViolationType}
              placeholder="VD: Sử dụng nguyên liệu không đạt chuẩn"
            />
          </FilterField>

          <FilterField label="Mức độ vi phạm">
            <GovSelect
              value={severity}
              onChange={setSeverity}
              options={[
                { value: '', label: '-- Chọn mức độ --' },
                { value: 'nhẹ', label: 'Nhẹ' },
                { value: 'trung bình', label: 'Trung bình' },
                { value: 'nghiêm trọng', label: 'Nghiêm trọng' },
              ]}
              width="100%"
            />
          </FilterField>

          <FilterField label="Mức phạt đề xuất">
            <GovInput
              value={penalty}
              onChange={setPenalty}
              placeholder="VD: 15.000.000 đ"
            />
          </FilterField>

          <FilterField label="Trạng thái xử lý">
            <GovInput value="Chưa xử lý" required />
          </FilterField>
        </div>

        <div style={{ marginTop: 16 }}>
          <FilterField label="Mô tả chi tiết vi phạm">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập nội dung biên bản vi phạm..."
              style={{
                width: '100%',
                minHeight: '120px',
                border: '1px solid #d0d7de',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </FilterField>
        </div>

        {selectedData && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '10px',
              background: '#fff7ed',
              border: '1px solid #fdba74',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle
              style={{
                width: 18,
                height: 18,
                color: '#ea580c',
                marginTop: 2,
              }}
            />

            <div>
              <div
                style={{
                  fontWeight: 700,
                  color: '#9a3412',
                  marginBottom: 4,
                }}
              >
                Cảnh báo vi phạm ATTP
              </div>

              <div
                style={{
                  fontSize: '13px',
                  color: '#7c2d12',
                  lineHeight: 1.6,
                }}
              >
                Mẫu kiểm nghiệm <strong>{selectedData.id}</strong> của cơ sở{' '}
                <strong>{selectedData.businessName}</strong> có kết quả không đạt.
                Cần xem xét lập biên bản và quyết định xử phạt theo quy định.
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '24px',
          }}
        >
          <GovBtn variant="secondary">
            Hủy bỏ
          </GovBtn>

          <GovBtn variant="primary">
            <Save style={{ width: 14, height: 14 }} />
            Lưu hồ sơ vi phạm
          </GovBtn>
        </div>
      </SectionCard>
    </div>
  );
}
