'use client';

import type { ElementType, ReactNode } from 'react';
import { FormEvent, useMemo, useState } from 'react';
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

export interface InspectionSampleOption {
  id: string;
  facilityId: string;
  sampleCode: string;
  sampleName: string;
  sampleType: string;
  collectedDate: string;
  business: string;
}

export interface InspectionTesterOption {
  id: string;
  name: string;
}

export interface CreateInspectionRequestPayload {
  sampleId: string;
  facilityId: string;
  sampleType: string;
  criteria: string[];
  requestDescription: string;
  inspectionAgency: string;
  testerId: string;
}

interface CreateInspectionRequestFormProps {
  sampleOptions: InspectionSampleOption[];
  testerOptions: InspectionTesterOption[];
  onCancel: () => void;
  onCreate: (payload: CreateInspectionRequestPayload) => Promise<FoodInspectionRequestRecord>;
  onSuccess: (request: FoodInspectionRequestRecord) => void;
}

interface FormState {
  selectedSampleId: string;
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
  testerId: string;
}

const inspectionAgencies = [
  'Trung tâm Kiểm nghiệm Đà Nẵng',
  'Viện Kiểm định An toàn thực phẩm Miền Trung',
  'Lab Việt Nam',
];

const initialFormState: FormState = {
  selectedSampleId: '',
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
  testerId: '',
};

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
  sampleOptions,
  testerOptions,
  onCancel,
  onCreate,
  onSuccess,
}: CreateInspectionRequestFormProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [showValidation, setShowValidation] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedSample = useMemo(
    () => sampleOptions.find((sample) => sample.id === form.selectedSampleId) ?? null,
    [form.selectedSampleId, sampleOptions]
  );

  const selectedCriteria = useMemo(() => {
    const criteria: string[] = [];
    if (form.criteria.microbiology) criteria.push('Vi sinh');
    if (form.criteria.chemistry) criteria.push('Hóa học');
    if (form.criteria.heavyMetals) criteria.push('Kim loại nặng');
    if (form.criteria.sensory) criteria.push('Cảm quan');
    if (form.criteria.other && form.otherCriteria.trim()) criteria.push(form.otherCriteria.trim());
    return criteria;
  }, [form.criteria, form.otherCriteria]);

  const needsOtherCriteria = form.criteria.other && form.otherCriteria.trim().length === 0;
  const isFormValid =
    !!selectedSample &&
    selectedCriteria.length > 0 &&
    !needsOtherCriteria &&
    form.requestDescription.trim().length > 0 &&
    form.inspectionAgency.trim().length > 0 &&
    form.testerId.trim().length > 0;

  const sampleError = showValidation && !selectedSample ? 'Vui lòng chọn mẫu để tạo yêu cầu' : '';
  const criteriaError = showValidation && selectedCriteria.length === 0 ? 'Vui lòng chọn ít nhất một chỉ tiêu' : '';
  const otherCriteriaError = showValidation && needsOtherCriteria ? 'Vui lòng nhập chỉ tiêu khác' : '';
  const descriptionError =
    showValidation && form.requestDescription.trim().length === 0 ? 'Vui lòng nhập nội dung yêu cầu kiểm định' : '';
  const agencyError =
    showValidation && form.inspectionAgency.trim().length === 0 ? 'Vui lòng chọn cơ quan kiểm định' : '';
  const testerError =
    showValidation && form.testerId.trim().length === 0 ? 'Vui lòng chọn kiểm định viên phụ trách' : '';

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

    if (!selectedSample || !isFormValid) {
      setSubmitError('Vui lòng nhập đầy đủ thông tin trước khi tạo yêu cầu kiểm nghiệm');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const created = await onCreate({
        sampleId: selectedSample.sampleCode,
        facilityId: selectedSample.facilityId,
        sampleType: selectedSample.sampleType,
        criteria: selectedCriteria,
        requestDescription: form.requestDescription.trim(),
        inspectionAgency: form.inspectionAgency.trim(),
        testerId: form.testerId,
      });
      onSuccess(created);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Không thể tạo yêu cầu kiểm nghiệm lúc này');
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
              <p className="text-sm text-slate-600">Chọn mẫu đã thu thập để lập yêu cầu kiểm nghiệm.</p>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="sampleSelector">Chọn mẫu</FieldLabel>
              <select
                id="sampleSelector"
                value={form.selectedSampleId}
                onChange={(event) => {
                  setForm((current) => ({ ...current, selectedSampleId: event.target.value }));
                  setSubmitError('');
                }}
                disabled={isSubmitting}
                className={cn(
                  'h-10 w-full border bg-white px-3 text-sm text-slate-800 outline-none transition',
                  sampleError ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300 focus:border-sky-600'
                )}
              >
                <option value="">Chọn mẫu theo mã</option>
                {sampleOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {`${item.sampleCode} - ${item.sampleName} | ${item.business}`}
                  </option>
                ))}
              </select>
              {sampleError && <p className="text-sm text-red-600">{sampleError}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ReadOnlyField label="Mã mẫu" value={selectedSample?.sampleCode ?? 'Chưa chọn'} />
              <ReadOnlyField label="Tên mẫu" value={selectedSample?.sampleName ?? 'Chưa chọn'} />
              <ReadOnlyField label="Ngày lấy mẫu" value={selectedSample?.collectedDate ?? 'Chưa chọn'} />
              <ReadOnlyField label="Cơ sở lấy mẫu" value={selectedSample?.business ?? 'Chưa chọn'} />
            </div>
          </SectionCard>

          <SectionCard className={criteriaError ? 'border-red-300' : undefined}>
            <div className="space-y-1">
              <SectionTitle icon={FiLayers}>2. Chỉ tiêu kiểm định</SectionTitle>
              <p className="text-sm text-slate-600">Chọn ít nhất một chỉ tiêu kiểm định cho mẫu.</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {[
                ['microbiology', 'Vi sinh'],
                ['chemistry', 'Hóa học'],
                ['heavyMetals', 'Kim loại nặng'],
                ['sensory', 'Cảm quan'],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 border border-slate-300 px-4 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.criteria[key as keyof FormState['criteria']]}
                    onChange={(event) => handleCriteriaChange(key as keyof FormState['criteria'], event.target.checked)}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600"
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="space-y-2 border border-slate-300 px-4 py-3">
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.criteria.other}
                  onChange={(event) => handleCriteriaChange('other', event.target.checked)}
                  disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              <p className="text-sm text-slate-600">Chọn cơ quan và kiểm định viên phụ trách mẫu.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="inspectionAgency">Cơ quan kiểm định</FieldLabel>
                <select
                  id="inspectionAgency"
                  value={form.inspectionAgency}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, inspectionAgency: event.target.value }));
                    setSubmitError('');
                  }}
                  disabled={isSubmitting}
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

              <div className="space-y-2">
                <FieldLabel htmlFor="testerId">Kiểm định viên</FieldLabel>
                <select
                  id="testerId"
                  value={form.testerId}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, testerId: event.target.value }));
                    setSubmitError('');
                  }}
                  disabled={isSubmitting}
                  className={cn(
                    'h-10 w-full border bg-white px-3 text-sm text-slate-800 outline-none transition',
                    testerError ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-300 focus:border-sky-600'
                  )}
                >
                  <option value="">Chọn kiểm định viên</option>
                  {testerOptions.map((tester) => (
                    <option key={tester.id} value={tester.id}>
                      {tester.name}
                    </option>
                  ))}
                </select>
                {testerError && <p className="text-sm text-red-600">{testerError}</p>}
              </div>
            </div>
          </SectionCard>

          <div className="flex items-center justify-end gap-3 border-t border-slate-300 pt-3">
            <GovBtn variant="secondary" onClick={onCancel} disabled={isSubmitting}>
              Hủy
            </GovBtn>
            <GovBtn variant="primary" type="submit" disabled={isSubmitting || (showValidation && !isFormValid)}>
              {isSubmitting ? 'Đang tạo...' : 'Tạo đơn'}
            </GovBtn>
          </div>
        </form>
      </TableCard>
    </div>
  );
}
