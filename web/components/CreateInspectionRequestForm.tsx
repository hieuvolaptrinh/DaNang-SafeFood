'use client';

import type { ElementType, ReactNode } from 'react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { FiClipboard, FiFileText, FiLayers, FiSend } from 'react-icons/fi';
import AlertBanner from '@/components/AlertBanner';
import { GovBtn } from '@/components/GovUI';
import TableCard from '@/components/TableCard';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface FoodInspectionRequestRecord {
  id: string;
  business: string;
  sampleType: string;
  requestDate: string;
  deadline: string;
  status: 'pending' | 'processing' | 'completed';
  lab: string;
}

interface CreateInspectionRequestFormProps {
  selectedSampleId: string;
  onCancel: () => void;
  onSuccess: (request: FoodInspectionRequestRecord) => void;
}

interface CollectedSample {
  id: string;
  sampleCode: string;
  sampleName: string;
  collectedDate: string;
  business: string;
}

interface FormState {
  criteria: {
    microbiology: boolean;
    chemistry: boolean;
    heavyMetals: boolean;
    sensory: boolean;
    other: boolean;
  };
  otherCriteria: string;
  requestDescription: string;
  inspectionAgency: string;
}

const mockCollectedSamples: CollectedSample[] = [
  {
    id: 'SAMPLE-2025-001',
    sampleCode: 'M-2025-001',
    sampleName: 'Mẫu hải sản tươi sống',
    collectedDate: '26/03/2025',
    business: 'Nhà hàng Hải Sản Biển Xanh',
  },
  {
    id: 'SAMPLE-2025-002',
    sampleCode: 'M-2025-002',
    sampleName: 'Mẫu rau củ hữu cơ',
    collectedDate: '25/03/2025',
    business: 'Cửa hàng Thực phẩm Sạch Organic',
  },
  {
    id: 'SAMPLE-2025-003',
    sampleCode: 'M-2025-003',
    sampleName: 'Mẫu nước đá',
    collectedDate: '24/03/2025',
    business: 'Siêu thị Mini Mart Đà Nẵng',
  },
];

const inspectionAgencies = [
  'Trung tâm Kiểm nghiệm Đà Nẵng',
  'Viện Kiểm định An toàn thực phẩm Miền Trung',
  'Lab Việt Nam',
];

const initialFormState: FormState = {
  criteria: {
    microbiology: false,
    chemistry: false,
    heavyMetals: false,
    sensory: false,
    other: false,
  },
  otherCriteria: '',
  requestDescription: '',
  inspectionAgency: '',
};

function getCollectedSample(sampleId: string) {
  return mockCollectedSamples.find((sample) => sample.id === sampleId) ?? null;
}

function addDays(baseDate: Date, days: number) {
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function mockCreateInspectionRequest(sample: CollectedSample, form: FormState) {
  return new Promise<FoodInspectionRequestRecord>((resolve) => {
    window.setTimeout(() => {
      const now = new Date();
      resolve({
        id: `YC-${Date.now().toString().slice(-7)}`,
        business: sample.business,
        sampleType: sample.sampleName,
        requestDate: now.toLocaleDateString('vi-VN'),
        deadline: addDays(now, 7).toLocaleDateString('vi-VN'),
        status: 'pending',
        lab: form.inspectionAgency,
      });
    }, 1200);
  });
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: ElementType;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center border border-emerald-200 bg-emerald-50 text-emerald-700">
        <Icon className="text-[16px]" />
      </div>
      <div>
        <h2 className="text-[13px] font-bold uppercase tracking-[0.04em] text-emerald-800">{children}</h2>
      </div>
    </div>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-800">
      {children}
    </label>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex min-h-10 items-center border border-slate-300 bg-slate-50 px-3 py-2 text-[13px] font-medium text-slate-700">
        {value}
      </div>
    </div>
  );
}

function SectionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn('space-y-4 border border-slate-300 bg-white p-5 shadow-sm', className)}>{children}</section>;
}

export default function CreateInspectionRequestForm({
  selectedSampleId,
  onCancel,
  onSuccess,
}: CreateInspectionRequestFormProps) {
  const [selectedSampleIdState, setSelectedSampleIdState] = useState(selectedSampleId);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [showValidation, setShowValidation] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSelectedSampleIdState(selectedSampleId);
  }, [selectedSampleId]);

  const sample = useMemo(() => getCollectedSample(selectedSampleIdState), [selectedSampleIdState]);

  const selectedCriteriaCount = Object.values(form.criteria).filter(Boolean).length;
  const isSampleMissing = !sample;
  const needsOtherCriteria = form.criteria.other && form.otherCriteria.trim().length === 0;
  const hasDescription = form.requestDescription.trim().length > 0;
  const hasAgency = form.inspectionAgency.trim().length > 0;
  const isFormValid =
    !isSampleMissing &&
    selectedCriteriaCount > 0 &&
    !needsOtherCriteria &&
    hasDescription &&
    hasAgency;

  const shouldDisableSubmit = isSubmitting || (showValidation && !isFormValid);

  const sampleError = showValidation && isSampleMissing ? 'Vui lòng chọn mẫu đã thu thập trước khi tạo yêu cầu' : '';
  const criteriaError =
    showValidation && selectedCriteriaCount === 0
      ? 'Vui lòng chọn ít nhất một chỉ tiêu để kiểm định'
      : '';
  const otherCriteriaError =
    showValidation && needsOtherCriteria ? 'Vui lòng nhập chỉ tiêu khác' : '';
  const descriptionError =
    showValidation && !hasDescription ? 'Vui lòng nhập nội dung yêu cầu kiểm định' : '';
  const agencyError =
    showValidation && !hasAgency ? 'Vui lòng chọn cơ quan kiểm định' : '';

  const handleCriteriaChange = (key: keyof FormState['criteria'], checked: boolean) => {
    setForm((current) => ({
      ...current,
      criteria: {
        ...current.criteria,
        [key]: checked,
      },
      otherCriteria: key === 'other' && !checked ? '' : current.otherCriteria,
    }));
    setSubmitError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowValidation(true);

    if (isSampleMissing) {
      setSubmitError('Vui lòng chọn mẫu đã thu thập trước khi tạo yêu cầu');
      return;
    }

    if (selectedCriteriaCount === 0) {
      setSubmitError('Vui lòng chọn ít nhất một chỉ tiêu để kiểm định');
      return;
    }

    if (!isFormValid || !sample) {
      setSubmitError('Vui lòng nhập đầy đủ thông tin trước khi tạo đơn');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const request = await mockCreateInspectionRequest(sample, form);
      onSuccess(request);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {submitError && <AlertBanner type="danger" title={submitError} className="mb-4" />}

      <TableCard title="Tạo yêu cầu kiểm định thực phẩm">
        <form onSubmit={handleSubmit} className="space-y-6 p-5" noValidate>
          <SectionCard className={sampleError ? 'border-red-300' : undefined}>
            <div className="space-y-1">
              <SectionTitle icon={FiClipboard}>1. Thông tin mẫu</SectionTitle>
              <p className="text-sm text-slate-600">
                Chọn mẫu theo mã mẫu. Hệ thống hiển thị kèm tên mẫu, cơ sở và ngày lấy mẫu để tránh chọn nhầm.
              </p>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="sampleSelector">Chọn mẫu đã thu thập</FieldLabel>
              <select
                id="sampleSelector"
                value={selectedSampleIdState}
                onChange={(event) => {
                  setSelectedSampleIdState(event.target.value);
                  setSubmitError('');
                }}
                disabled={isSubmitting}
                className={cn(
                  'h-10 w-full border bg-white px-3 text-sm text-slate-800 outline-none transition',
                  sampleError ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300 focus:border-sky-600'
                )}
              >
                <option value="">Chọn mẫu theo mã</option>
                {mockCollectedSamples.map((item) => (
                  <option key={item.id} value={item.id}>
                    {`${item.sampleCode} - ${item.sampleName} | ${item.business}`}
                  </option>
                ))}
              </select>
              {sampleError && <p className="text-sm text-red-600">{sampleError}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ReadOnlyField label="Mã mẫu" value={sample?.sampleCode ?? 'Chưa chọn'} />
              <ReadOnlyField label="Tên mẫu" value={sample?.sampleName ?? 'Chưa chọn'} />
              <ReadOnlyField label="Ngày lấy mẫu" value={sample?.collectedDate ?? 'Chưa chọn'} />
              <ReadOnlyField label="Cơ sở lấy mẫu" value={sample?.business ?? 'Chưa chọn'} />
            </div>
          </SectionCard>

          <SectionCard className={criteriaError ? 'border-red-300' : undefined}>
            <div className="space-y-1">
              <SectionTitle icon={FiLayers}>2. Chỉ tiêu kiểm định</SectionTitle>
              <p className="text-sm text-slate-600">Chọn ít nhất một chỉ tiêu kiểm định cho mẫu.</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 border border-slate-300 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.criteria.microbiology}
                  onChange={(event) => handleCriteriaChange('microbiology', event.target.checked)}
                  disabled={isSampleMissing || isSubmitting}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600"
                />
                Vi sinh
              </label>
              <label className="flex items-center gap-3 border border-slate-300 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.criteria.chemistry}
                  onChange={(event) => handleCriteriaChange('chemistry', event.target.checked)}
                  disabled={isSampleMissing || isSubmitting}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600"
                />
                Hóa học
              </label>
              <label className="flex items-center gap-3 border border-slate-300 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.criteria.heavyMetals}
                  onChange={(event) => handleCriteriaChange('heavyMetals', event.target.checked)}
                  disabled={isSampleMissing || isSubmitting}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600"
                />
                Kim loại nặng
              </label>
              <label className="flex items-center gap-3 border border-slate-300 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.criteria.sensory}
                  onChange={(event) => handleCriteriaChange('sensory', event.target.checked)}
                  disabled={isSampleMissing || isSubmitting}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600"
                />
                Cảm quan
              </label>
            </div>

            <div className="space-y-2 border border-slate-300 px-4 py-3">
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.criteria.other}
                  onChange={(event) => handleCriteriaChange('other', event.target.checked)}
                  disabled={isSampleMissing || isSubmitting}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600"
                />
                Khác
              </label>

              {form.criteria.other && (
                <div className="space-y-2">
                  <Input
                    value={form.otherCriteria}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, otherCriteria: event.target.value }));
                      setSubmitError('');
                    }}
                    placeholder="Nhập chỉ tiêu khác"
                    disabled={isSampleMissing || isSubmitting}
                    aria-invalid={Boolean(otherCriteriaError)}
                    className="h-10 border-slate-300 bg-white"
                  />
                  {otherCriteriaError && <p className="text-sm text-red-600">{otherCriteriaError}</p>}
                </div>
              )}
            </div>

            {criteriaError && <p className="text-sm font-medium text-red-600">{criteriaError}</p>}
          </SectionCard>

          <SectionCard>
            <div className="space-y-1">
              <SectionTitle icon={FiFileText}>3. Nội dung yêu cầu</SectionTitle>
              <p className="text-sm text-slate-600">Mô tả rõ nội dung và mục tiêu kiểm định.</p>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="requestDescription">Yêu cầu kiểm định</FieldLabel>
              <textarea
                id="requestDescription"
                rows={5}
                value={form.requestDescription}
                onChange={(event) => {
                  setForm((current) => ({ ...current, requestDescription: event.target.value }));
                  setSubmitError('');
                }}
                disabled={isSampleMissing || isSubmitting}
                placeholder="Nhập yêu cầu kiểm định chi tiết..."
                className={cn(
                  'w-full border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition',
                  descriptionError ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300 focus:border-sky-600'
                )}
              />
              {descriptionError && <p className="text-sm text-red-600">{descriptionError}</p>}
            </div>
          </SectionCard>

          <SectionCard>
            <div className="space-y-1">
              <SectionTitle icon={FiSend}>4. Gửi đến</SectionTitle>
              <p className="text-sm text-slate-600">Chọn cơ quan thực hiện kiểm định mẫu thực phẩm.</p>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="inspectionAgency">Cơ quan kiểm định</FieldLabel>
              <select
                id="inspectionAgency"
                value={form.inspectionAgency}
                onChange={(event) => {
                  setForm((current) => ({ ...current, inspectionAgency: event.target.value }));
                  setSubmitError('');
                }}
                disabled={isSampleMissing || isSubmitting}
                className={cn(
                  'h-10 w-full border bg-white px-3 text-sm text-slate-800 outline-none transition',
                  agencyError ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300 focus:border-sky-600'
                )}
              >
                <option value="">Chọn cơ quan kiểm định</option>
                {inspectionAgencies.map((agency) => (
                  <option key={agency} value={agency}>
                    {agency}
                  </option>
                ))}
              </select>
              {agencyError && <p className="text-sm text-red-600">{agencyError}</p>}
            </div>
          </SectionCard>

          <div className="flex items-center justify-end gap-3 border-t border-slate-300 pt-3">
            <GovBtn variant="secondary" onClick={onCancel} disabled={isSubmitting}>
              Hủy
            </GovBtn>
            <GovBtn variant="primary" type="submit" disabled={shouldDisableSubmit}>
              {isSubmitting ? 'Đang tạo...' : 'Tạo đơn'}
            </GovBtn>
          </div>
        </form>
      </TableCard>
    </div>
  );
}
