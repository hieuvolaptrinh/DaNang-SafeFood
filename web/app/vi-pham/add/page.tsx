'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, Save, AlertTriangle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import {
  PageHeader,
  SectionCard,
  GovBtn,
  GovInput,
  GovSelect,
} from '@/components/GovUI';

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

  const selectedData = failedSamples.find(s => s.id === selectedSample);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-16">
      <PageHeader
        title="Thêm mới vi phạm"
        subtitle="Tạo hồ sơ vi phạm từ mẫu kiểm nghiệm không đạt"
        actions={
          <Link href="/vi-pham">
            <GovBtn variant="secondary">
              <ArrowLeft size={16} /> Quay lại
            </GovBtn>
          </Link>
        }
      />

      <div className="max-w-[1100px] mx-auto px-6 pt-6">
        {/* Alert */}
        <div className="mb-8">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex gap-4">
            <AlertTriangle className="text-orange-500 mt-0.5 flex-shrink-0" size={24} />
            <div>
              <p className="font-semibold text-orange-800">Chỉ chấp nhận mẫu kiểm nghiệm không đạt</p>
              <p className="text-sm text-orange-700 mt-1">
                Hệ thống chỉ cho phép lập vi phạm từ những mẫu có kết quả <strong>FAIL</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT - Form chính */}
          <div className="lg:col-span-8 space-y-8">

            {/* Thông tin mẫu kiểm nghiệm */}
            <SectionCard title="Thông tin mẫu kiểm nghiệm" className="shadow-sm">
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                      Chọn mẫu kiểm nghiệm không đạt
                    </label>
                    <GovSelect
                      value={selectedSample}
                      onChange={setSelectedSample}
                      options={[
                        { value: '', label: '-- Chọn mẫu kiểm nghiệm --' },
                        ...failedSamples.map(m => ({
                          value: m.id,
                          label: `${m.id} — ${m.businessName}`,
                        })),
                      ]}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                      Loại mẫu
                    </label>
                    <GovInput
                      value={selectedData?.sampleType || ''}
                      placeholder="Tự động hiển thị"
                      disabled={!selectedData}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                      Cơ sở kinh doanh
                    </label>
                    <GovInput
                      value={selectedData?.businessName || ''}
                      placeholder="Tự động hiển thị"
                      disabled={!selectedData}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                      Mã thanh tra
                    </label>
                    <GovInput
                      value={selectedData?.inspectionId || ''}
                      placeholder="Tự động hiển thị"
                      disabled={!selectedData}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Thông tin vi phạm */}
            <SectionCard title="Thông tin vi phạm" className="shadow-sm">
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                      Loại vi phạm
                    </label>
                    <GovInput
                      value={violationType}
                      onChange={setViolationType}
                      placeholder="Ví dụ: Sử dụng nguyên liệu không rõ nguồn gốc"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                      Mức độ vi phạm
                    </label>
                    <GovSelect
                      value={severity}
                      onChange={setSeverity}
                      options={[
                        { value: '', label: '-- Chọn mức độ --' },
                        { value: 'nhẹ', label: 'Nhẹ' },
                        { value: 'trung bình', label: 'Trung bình' },
                        { value: 'nghiêm trọng', label: 'Nghiêm trọng' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                      Mức phạt đề xuất (VNĐ)
                    </label>
                    <GovInput
                      value={penalty}
                      onChange={setPenalty}
                      placeholder="Ví dụ: 15.000.000"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                      Trạng thái xử lý
                    </label>
                    <GovInput value="Chưa xử lý" disabled />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                    Mô tả chi tiết vi phạm
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Nhập nội dung chi tiết biên bản vi phạm, bằng chứng, và khuyến nghị xử lý..."
                    className="w-full min-h-[140px] border border-slate-300 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-y"
                  />
                </div>

                {selectedData && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex gap-4">
                    <AlertCircle className="text-orange-500 mt-1 flex-shrink-0" size={24} />
                    <div className="text-sm text-orange-800">
                      <strong>Cảnh báo:</strong> Mẫu <span className="font-mono font-medium">{selectedData.id}</span> của cơ sở{' '}
                      <strong>{selectedData.businessName}</strong> có kết quả <strong className="text-red-600">KHÔNG ĐẠT</strong>.
                      Việc lập biên bản vi phạm là cần thiết.
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <GovBtn variant="secondary" onClick={() => window.history.back()}>
                    Hủy bỏ
                  </GovBtn>
                  <GovBtn variant="primary" disabled={!selectedData}>
                    <Save size={16} />
                    Lưu hồ sơ vi phạm
                  </GovBtn>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* RIGHT - Sidebar thông tin */}
          <div className="lg:col-span-4">
            <SectionCard title="Hướng dẫn" className="shadow-sm sticky top-6">
              <div className="p-6 text-sm text-slate-600 space-y-5">
                <div>
                  <div className="font-semibold text-slate-800 mb-1">Quy trình lập vi phạm</div>
                  <p className="text-xs leading-relaxed">
                    1. Chọn mẫu kiểm nghiệm không đạt<br />
                    2. Điền thông tin vi phạm<br />
                    3. Ghi rõ mức phạt đề xuất<br />
                    4. Lưu và chuyển cho bộ phận xử lý
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Sau khi lưu, hồ sơ sẽ được chuyển sang trạng thái <span className="font-medium text-slate-700">"Chờ xử lý"</span>.
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}