'use client';

import type { ReactNode } from 'react';
import { FormEvent, useMemo, useState } from 'react';
import AlertBanner from '@/components/AlertBanner';
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

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-bold text-slate-900">{children}</h2>;
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-800">
      {children}
    </label>
  );
}

export default function CreateInspectionRequestForm({
  selectedSampleId,
  onCancel,
  onSuccess,
}: CreateInspectionRequestFormProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [showValidation, setShowValidation] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sample = useMemo(() => getCollectedSample(selectedSampleId), [selectedSampleId]);

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

  const shouldDisableSubmit = isSubmitting || isSampleMissing || (showValidation && !isFormValid);

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
      setSubmitError('Không tìm thấy mã mẫu vật, vui lòng thực hiện chức năng Gửi mẫu trước');
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
      {isSampleMissing && (
        <AlertBanner
          type="danger"
          title="Không tìm thấy mã mẫu vật, vui lòng thực hiện chức năng Gửi mẫu trước"
        />
      )}

      {submitError && !isSampleMissing && (
        <AlertBanner type="danger" title={submitError} className="mb-4" />
      )}

      <TableCard title="Tạo yêu cầu kiểm định thực phẩm">
        <form onSubmit={handleSubmit} className="space-y-6 p-5" noValidate>
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            <div>
              <SectionTitle>1. Thông tin mẫu</SectionTitle>
              <p className="mt-1 text-sm text-slate-500">
                Thông tin mẫu được tự động lấy từ mẫu đã thu thập.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <FieldLabel htmlFor="sampleCode">Mã mẫu</FieldLabel>
                <Input id="sampleCode" value={sample?.sampleCode ?? ''} readOnly disabled={isSampleMissing} />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="sampleName">Tên mẫu</FieldLabel>
                <Input id="sampleName" value={sample?.sampleName ?? ''} readOnly disabled={isSampleMissing} />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="collectedDate">Ngày lấy mẫu</FieldLabel>
                <Input
                  id="collectedDate"
                  value={sample?.collectedDate ?? ''}
                  readOnly
                  disabled={isSampleMissing}
                />
              </div>
            </div>
          </section>

          <section
            className={cn(
              'space-y-4 rounded-xl border bg-white p-5',
              criteriaError ? 'border-red-200' : 'border-slate-200'
            )}
          >
            <div>
              <SectionTitle>2. Chỉ tiêu kiểm định</SectionTitle>
              <p className="mt-1 text-sm text-slate-500">Chọn ít nhất một chỉ tiêu kiểm định cho mẫu.</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.criteria.microbiology}
                  onChange={(event) => handleCriteriaChange('microbiology', event.target.checked)}
                  disabled={isSampleMissing || isSubmitting}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                Vi sinh
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.criteria.chemistry}
                  onChange={(event) => handleCriteriaChange('chemistry', event.target.checked)}
                  disabled={isSampleMissing || isSubmitting}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                Hóa học
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.criteria.heavyMetals}
                  onChange={(event) => handleCriteriaChange('heavyMetals', event.target.checked)}
                  disabled={isSampleMissing || isSubmitting}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                Kim loại nặng
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.criteria.sensory}
                  onChange={(event) => handleCriteriaChange('sensory', event.target.checked)}
                  disabled={isSampleMissing || isSubmitting}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                Cảm quan
              </label>
            </div>

            <div className="space-y-2 rounded-lg border border-slate-200 px-4 py-3">
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.criteria.other}
                  onChange={(event) => handleCriteriaChange('other', event.target.checked)}
                  disabled={isSampleMissing || isSubmitting}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
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
                  />
                  {otherCriteriaError && <p className="text-sm text-red-600">{otherCriteriaError}</p>}
                </div>
              )}
            </div>

            {criteriaError && <p className="text-sm font-medium text-red-600">{criteriaError}</p>}
          </section>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            <div>
              <SectionTitle>3. Nội dung yêu cầu</SectionTitle>
              <p className="mt-1 text-sm text-slate-500">Mô tả rõ nội dung và mục tiêu kiểm định.</p>
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
                  'w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition',
                  descriptionError ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200 focus:border-blue-500'
                )}
              />
              {descriptionError && <p className="text-sm text-red-600">{descriptionError}</p>}
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            <div>
              <SectionTitle>4. Gửi đến</SectionTitle>
              <p className="mt-1 text-sm text-slate-500">Chọn cơ quan thực hiện kiểm định mẫu thực phẩm.</p>
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
                  'h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-800 outline-none transition',
                  agencyError ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200 focus:border-blue-500'
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
          </section>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={shouldDisableSubmit}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo đơn'}
            </button>
          </div>
        </form>
      </TableCard>
    </div>
  );
}
