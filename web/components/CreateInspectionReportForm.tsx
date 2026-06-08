'use client';

import { ChangeEvent, FormEvent, ReactNode, RefObject, useMemo, useRef, useState } from 'react';
import { FiCheckCircle, FiFileText, FiPaperclip, FiTrash2 } from 'react-icons/fi';
import AlertBanner from '@/components/AlertBanner';
import Badge from '@/components/Badge';
import type { InspectionReportResult } from '@/data/mockData';
import { cn } from '@/lib/utils';

type InspectionTypeValue = 'Định kỳ' | 'Đột xuất' | 'Theo phản ánh';
type ReportResultValue = InspectionReportResult | '';

interface ReportFormState {
  facilityId: string;
  inspectionDate: string;
  inspectionType: InspectionTypeValue | '';
  content: string;
  comment: string;
  result: ReportResultValue;
  score: string;
  attachment: File | null;
  hasInspectionRecord: boolean;
}

type ReportFormField = keyof ReportFormState;
type ReportFormErrors = Partial<Record<ReportFormField, string>>;
type TouchedState = Partial<Record<ReportFormField, boolean>>;

export interface CreateInspectionReportPayload {
  facilityId: string;
  facilityName: string;
  district: string;
  inspectionDate: string;
  inspectionType: InspectionTypeValue;
  content: string;
  comment: string;
  result: InspectionReportResult;
  score: number;
  attachment: File;
  fileName: string;
  hasInspectionRecord: boolean;
}

export interface InspectionReportBusinessOption {
  id: string;
  name: string;
  district: string;
}

interface CreateInspectionReportFormProps {
  reportId: string;
  businessOptions: InspectionReportBusinessOption[];
  onCancel: () => void;
  onSubmit?: (values: CreateInspectionReportPayload) => Promise<void> | void;
}

interface FormSectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;

const inspectionTypeOptions: Array<{ value: InspectionTypeValue; label: string }> = [
  { value: 'Định kỳ', label: 'Định kỳ' },
  { value: 'Đột xuất', label: 'Đột xuất' },
  { value: 'Theo phản ánh', label: 'Theo phản ánh' },
];

const resultOptions: Array<{
  value: InspectionReportResult;
  label: string;
  description: string;
}> = [
  {
    value: 'pass',
    label: 'Đạt',
    description: 'Cơ sở đáp ứng yêu cầu và có thể duy trì theo dõi định kỳ.',
  },
  {
    value: 'fail',
    label: 'Không đạt',
    description: 'Cần lập yêu cầu khắc phục hoặc xử lý vi phạm theo quy định.',
  },
  {
    value: 'scheduled',
    label: 'Đã lên lịch',
    description: 'Báo cáo đã khởi tạo, chờ hoàn thiện hoặc cập nhật kết quả sau.',
  },
];

const allTouchedState: TouchedState = {
  facilityId: true,
  inspectionDate: true,
  inspectionType: true,
  content: true,
  comment: true,
  result: true,
  score: true,
  attachment: true,
  hasInspectionRecord: true,
};

function getTodayDateString() {
  const today = new Date();
  return new Date(today.getTime() - today.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

const initialFormState: ReportFormState = {
  facilityId: '',
  inspectionDate: getTodayDateString(),
  inspectionType: '',
  content: '',
  comment: '',
  result: '',
  score: '',
  attachment: null,
  hasInspectionRecord: true,
};

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getScoreFeedback(score: string) {
  if (score === '') {
    return {
      text: 'Nhập điểm từ 0 đến 100 để hiển thị mức đánh giá.',
      textClassName: 'text-slate-500',
      badgeClassName: 'border-slate-200 bg-slate-50 text-slate-600',
      inputClassName: 'border-slate-200 focus:border-blue-500',
    };
  }

  const value = Number(score);

  if (!Number.isFinite(value) || value < 0 || value > 100) {
    return {
      text: 'Điểm phải nằm trong khoảng 0 đến 100.',
      textClassName: 'text-red-600',
      badgeClassName: 'border-red-200 bg-red-50 text-red-700',
      inputClassName: 'border-red-300 text-red-700 focus:border-red-500',
    };
  }

  if (value >= 80) {
    return {
      text: 'Mức đánh giá tốt, có thể dùng làm mốc tham chiếu.',
      textClassName: 'text-emerald-600',
      badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      inputClassName: 'border-emerald-200 text-emerald-700 focus:border-emerald-500',
    };
  }

  if (value >= 50) {
    return {
      text: 'Mức trung bình, nên ghi rõ hạng mục cần cải thiện.',
      textClassName: 'text-amber-600',
      badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
      inputClassName: 'border-amber-200 text-amber-700 focus:border-amber-500',
    };
  }

  return {
    text: 'Mức rủi ro cao, cần lưu nhận xét và yêu cầu khắc phục cụ thể.',
    textClassName: 'text-red-600',
    badgeClassName: 'border-red-200 bg-red-50 text-red-700',
    inputClassName: 'border-red-200 text-red-700 focus:border-red-500',
  };
}

function validateForm(form: ReportFormState, fileError: string): ReportFormErrors {
  const errors: ReportFormErrors = {};

  if (!form.facilityId) {
    errors.facilityId = 'Vui lòng chọn cơ sở được lập báo cáo.';
  }

  if (!form.inspectionDate) {
    errors.inspectionDate = 'Vui lòng chọn ngày kiểm tra.';
  }

  if (!form.inspectionType) {
    errors.inspectionType = 'Vui lòng chọn loại thanh tra.';
  }

  if (!form.content.trim()) {
    errors.content = 'Vui lòng nhập nội dung báo cáo.';
  }

  if (!form.comment.trim()) {
    errors.comment = 'Vui lòng nhập nhận xét tổng quan.';
  }

  if (!form.result) {
    errors.result = 'Vui lòng chọn kết quả.';
  }

  if (form.score === '') {
    errors.score = 'Vui lòng nhập điểm đánh giá.';
  } else {
    const score = Number(form.score);

    if (!Number.isFinite(score) || score < 0 || score > 100) {
      errors.score = 'Điểm phải nằm trong khoảng từ 0 đến 100.';
    }
  }

  if (fileError) {
    errors.attachment = fileError;
  } else if (!form.attachment) {
    errors.attachment = 'Vui lòng tải lên ít nhất một tệp đính kèm.';
  }

  if (!form.hasInspectionRecord) {
    errors.hasInspectionRecord = 'Cần xác nhận biên bản kiểm tra đã được lập và lưu trước khi gửi báo cáo.';
  }

  return errors;
}

function FormSectionCard({ title, description, children }: FormSectionCardProps) {
  return (
    <section className="overflow-hidden border border-slate-300 bg-white shadow-sm">
      <div className="border-b border-slate-300 px-5 py-4">
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
        {description && <p className="mt-1 text-[13px] text-slate-500">{description}</p>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function FormField({ label, htmlFor, required, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-800">
          {label}
        </label>
        {required && <span className="text-sm font-semibold text-red-500">*</span>}
      </div>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

function ReportInfoSection({
  reportId,
  businessOptions,
  form,
  errors,
  showError,
  onFieldBlur,
  onFieldChange,
}: {
  reportId: string;
  businessOptions: InspectionReportBusinessOption[];
  form: ReportFormState;
  errors: ReportFormErrors;
  showError: (field: ReportFormField) => boolean;
  onFieldBlur: (field: ReportFormField) => void;
  onFieldChange: <K extends ReportFormField>(field: K, value: ReportFormState[K]) => void;
}) {
  return (
    <FormSectionCard
      title="Thông tin báo cáo"
      description="Liên kết báo cáo với cơ sở và đợt thanh tra tương ứng."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Mã báo cáo" htmlFor="report-id" hint="Mã được tự động sinh khi lưu báo cáo.">
          <input
            id="report-id"
            readOnly
            value={reportId}
            className="w-full border border-slate-300 bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-700 outline-none"
          />
        </FormField>

        <FormField
          label="Cơ sở"
          htmlFor="facility"
          required
          error={showError('facilityId') ? errors.facilityId : undefined}
        >
          <select
            id="facility"
            value={form.facilityId}
            onChange={(event) => onFieldChange('facilityId', event.target.value)}
            onBlur={() => onFieldBlur('facilityId')}
            className={cn(
              'w-full cursor-pointer appearance-none border bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-800 outline-none transition',
              'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")] bg-[right_12px_center] bg-no-repeat',
              showError('facilityId') && errors.facilityId ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-sky-600'
            )}
          >
            <option value="">Chọn cơ sở kinh doanh</option>
            {businessOptions.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name} • {business.district}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Ngày kiểm tra"
          htmlFor="inspection-date"
          required
          error={showError('inspectionDate') ? errors.inspectionDate : undefined}
        >
          <input
            id="inspection-date"
            type="date"
            value={form.inspectionDate}
            onChange={(event) => onFieldChange('inspectionDate', event.target.value)}
            onBlur={() => onFieldBlur('inspectionDate')}
            className={cn(
              'w-full border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition',
              showError('inspectionDate') && errors.inspectionDate
                ? 'border-red-300 focus:border-red-500'
                : 'border-slate-300 focus:border-sky-600'
            )}
          />
        </FormField>

        <FormField
          label="Loại thanh tra"
          htmlFor="inspection-type"
          required
          error={showError('inspectionType') ? errors.inspectionType : undefined}
        >
          <select
            id="inspection-type"
            value={form.inspectionType}
            onChange={(event) => onFieldChange('inspectionType', event.target.value as InspectionTypeValue | '')}
            onBlur={() => onFieldBlur('inspectionType')}
            className={cn(
              'w-full cursor-pointer appearance-none border bg-slate-50 px-3 py-2.5 pr-9 text-sm text-slate-800 outline-none transition',
              'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")] bg-[right_12px_center] bg-no-repeat',
              showError('inspectionType') && errors.inspectionType
                ? 'border-red-300 focus:border-red-500'
                : 'border-slate-300 focus:border-sky-600'
            )}
          >
            <option value="">Chọn loại thanh tra</option>
            {inspectionTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </FormSectionCard>
  );
}

function ReportContentSection({
  form,
  errors,
  showError,
  onFieldBlur,
  onFieldChange,
}: {
  form: ReportFormState;
  errors: ReportFormErrors;
  showError: (field: ReportFormField) => boolean;
  onFieldBlur: (field: ReportFormField) => void;
  onFieldChange: <K extends ReportFormField>(field: K, value: ReportFormState[K]) => void;
}) {
  return (
    <FormSectionCard
      title="Nội dung báo cáo"
      description="Mô tả phạm vi kiểm tra, hạng mục đã đối chiếu và các phát hiện chính."
    >
      <FormField
        label="Nội dung báo cáo"
        htmlFor="report-content"
        required
        hint="Nêu rõ khu vực kiểm tra, hồ sơ đã đối chiếu và tình trạng ghi nhận tại hiện trường."
        error={showError('content') ? errors.content : undefined}
      >
        <textarea
          id="report-content"
          rows={6}
          value={form.content}
          onChange={(event) => onFieldChange('content', event.target.value)}
          onBlur={() => onFieldBlur('content')}
          placeholder="Ví dụ: Đã kiểm tra khu sơ chế, kho bảo quản, hồ sơ nguồn gốc nguyên liệu và quy trình vệ sinh dụng cụ..."
          className={cn(
            'w-full border bg-slate-50 px-3 py-2.5 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400',
            showError('content') && errors.content ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-sky-600'
          )}
        />
      </FormField>
    </FormSectionCard>
  );
}

function ReportCommentSection({
  form,
  errors,
  showError,
  onFieldBlur,
  onFieldChange,
}: {
  form: ReportFormState;
  errors: ReportFormErrors;
  showError: (field: ReportFormField) => boolean;
  onFieldBlur: (field: ReportFormField) => void;
  onFieldChange: <K extends ReportFormField>(field: K, value: ReportFormState[K]) => void;
}) {
  return (
    <FormSectionCard
      title="Nhận xét tổng quan"
      description="Tổng hợp đánh giá chung, khuyến nghị và định hướng theo dõi sau kiểm tra."
    >
      <FormField
        label="Nhận xét"
        htmlFor="report-comment"
        required
        hint="Có thể ghi khuyến nghị duy trì, yêu cầu khắc phục hoặc lưu ý cho lần tái kiểm tra."
        error={showError('comment') ? errors.comment : undefined}
      >
        <textarea
          id="report-comment"
          rows={4}
          value={form.comment}
          onChange={(event) => onFieldChange('comment', event.target.value)}
          onBlur={() => onFieldBlur('comment')}
          placeholder="Ví dụ: Cơ sở đáp ứng cơ bản các yêu cầu, cần bổ sung nhật ký vệ sinh định kỳ và duy trì lưu mẫu đúng quy định..."
          className={cn(
            'w-full border bg-slate-50 px-3 py-2.5 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400',
            showError('comment') && errors.comment ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-sky-600'
          )}
        />
      </FormField>
    </FormSectionCard>
  );
}

function ResultSection({
  form,
  errors,
  showError,
  onFieldBlur,
  onFieldChange,
}: {
  form: ReportFormState;
  errors: ReportFormErrors;
  showError: (field: ReportFormField) => boolean;
  onFieldBlur: (field: ReportFormField) => void;
  onFieldChange: <K extends ReportFormField>(field: K, value: ReportFormState[K]) => void;
}) {
  const scoreFeedback = getScoreFeedback(form.score);

  return (
    <FormSectionCard
      title="Kết quả & điểm"
      description="Chọn trạng thái báo cáo và ghi điểm tổng hợp cho đợt kiểm tra."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-slate-800">Kết quả</p>
            <span className="text-sm font-semibold text-red-500">*</span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {resultOptions.map((option) => {
              const isSelected = form.result === option.value;

              return (
                <label
                  key={option.value}
                  className={cn(
                    'cursor-pointer border p-4 transition-all',
                    isSelected
                      ? 'border-sky-300 bg-sky-50 shadow-sm'
                      : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                  )}
                >
                  <input
                    type="radio"
                    name="report-result"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => onFieldChange('result', option.value)}
                    onBlur={() => onFieldBlur('result')}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Badge variant={option.value} label={option.label} />
                      <p className="text-[13px] leading-5 text-slate-600">{option.description}</p>
                    </div>
                    <span
                      className={cn(
                        'mt-1 h-4 w-4 rounded-full border-2 transition-colors',
                        isSelected ? 'border-blue-600 bg-blue-600 ring-4 ring-blue-100' : 'border-slate-300 bg-white'
                      )}
                    />
                  </div>
                </label>
              );
            })}
          </div>

          {showError('result') && errors.result && <p className="text-sm font-medium text-red-600">{errors.result}</p>}
        </div>

        <div className="space-y-4 border border-slate-300 bg-slate-50 p-4">
          <FormField
            label="Điểm đánh giá"
            htmlFor="report-score"
            required
            hint="Thang điểm từ 0 đến 100."
            error={showError('score') ? errors.score : undefined}
          >
            <input
              id="report-score"
              type="number"
              min={0}
              max={100}
              value={form.score}
              onChange={(event) => onFieldChange('score', event.target.value)}
              onBlur={() => onFieldBlur('score')}
              placeholder="Nhập điểm"
              className={cn(
                'w-full border bg-white px-3 py-2.5 text-sm outline-none transition',
                scoreFeedback.inputClassName,
                showError('score') && errors.score ? 'border-red-300 focus:border-red-500' : ''
              )}
            />
          </FormField>

          <div className={cn('border px-4 py-3 text-sm font-semibold', scoreFeedback.badgeClassName)}>
            {form.score === '' ? 'Chưa nhập điểm' : `${form.score}/100`}
          </div>

          <p className={cn('text-sm', scoreFeedback.textClassName)}>{scoreFeedback.text}</p>
        </div>
      </div>
    </FormSectionCard>
  );
}

function AttachmentSection({
  form,
  errors,
  showError,
  onFieldBlur,
  inputRef,
  onFileChange,
  onRemoveFile,
}: {
  form: ReportFormState;
  errors: ReportFormErrors;
  showError: (field: ReportFormField) => boolean;
  onFieldBlur: (field: ReportFormField) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}) {
  return (
    <FormSectionCard
      title="Tệp đính kèm"
      description="Đính kèm biên bản, minh chứng hoặc tài liệu liên quan đến báo cáo."
    >
      <div className="space-y-4">
        <FormField
          label="Tải tệp lên"
          htmlFor="report-attachment"
          required
          hint={`Dung lượng tối đa: ${formatFileSize(MAX_ATTACHMENT_SIZE)}. Hỗ trợ PDF, DOC, DOCX, PNG, JPG.`}
          error={showError('attachment') ? errors.attachment : undefined}
        >
          <input
            ref={inputRef}
            id="report-attachment"
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={onFileChange}
            onBlur={() => onFieldBlur('attachment')}
            className={cn(
              'w-full border bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition file:mr-3 file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700',
              showError('attachment') && errors.attachment ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-sky-600'
            )}
          />
        </FormField>

        {form.attachment && (
          <div className="border border-slate-300 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-sky-200 bg-sky-50 text-sky-600">
                  <FiPaperclip size={18} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{form.attachment.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(form.attachment.size)}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onRemoveFile}
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center border border-slate-300 bg-white text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                aria-label="Xóa tệp đính kèm"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </FormSectionCard>
  );
}

function ConfirmationSection({
  checked,
  error,
  showError,
  onBlur,
  onChange,
}: {
  checked: boolean;
  error?: string;
  showError: boolean;
  onBlur: () => void;
  onChange: (checked: boolean) => void;
}) {
  return (
    <FormSectionCard
      title="Xác nhận"
      description="Bước xác nhận cuối trước khi lưu báo cáo vào danh sách."
    >
      <label
        className={cn(
          'flex cursor-pointer items-start justify-between gap-4 border p-4 transition-all',
          checked ? 'border-emerald-200 bg-emerald-50' : 'border-slate-300 bg-slate-50'
        )}
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            onBlur={onBlur}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
          />
          <div>
            <p className="text-sm font-semibold text-slate-800">Biên bản kiểm tra đã được lập và lưu</p>
            <p className="mt-1 text-[13px] leading-5 text-slate-500">
              Báo cáo chỉ được gửi khi biên bản kiểm tra đã được xác nhận và lưu trong hệ thống.
            </p>
          </div>
        </div>

        <div
          className={cn(
            'flex h-9 w-9 flex-shrink-0 items-center justify-center border',
            checked ? 'border-emerald-200 bg-white text-emerald-600' : 'border-slate-200 bg-white text-slate-400'
          )}
        >
          <FiCheckCircle size={18} />
        </div>
      </label>

      {showError && error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
    </FormSectionCard>
  );
}

export default function CreateInspectionReportForm({
  reportId,
  businessOptions,
  onCancel,
  onSubmit,
}: CreateInspectionReportFormProps) {
  const [form, setForm] = useState<ReportFormState>(initialFormState);
  const [touched, setTouched] = useState<TouchedState>({});
  const [fileError, setFileError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedFacility = useMemo(
    () => businessOptions.find((business) => business.id === form.facilityId),
    [businessOptions, form.facilityId]
  );

  const errors = useMemo(() => validateForm(form, fileError), [fileError, form]);
  const isFormValid = Object.keys(errors).length === 0;
  const showError = (field: ReportFormField) => Boolean(touched[field]);

  const handleFieldBlur = (field: ReportFormField) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const handleFieldChange = <K extends ReportFormField>(field: K, value: ReportFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitError('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    setTouched((current) => ({ ...current, attachment: true }));
    setSubmitError('');

    if (!nextFile) {
      setForm((current) => ({ ...current, attachment: null }));
      setFileError('');
      return;
    }

    if (nextFile.size > MAX_ATTACHMENT_SIZE) {
      event.target.value = '';
      setForm((current) => ({ ...current, attachment: null }));
      setFileError('Tệp đính kèm vượt quá dung lượng tối đa cho phép.');
      return;
    }

    setForm((current) => ({ ...current, attachment: nextFile }));
    setFileError('');
  };

  const handleRemoveFile = () => {
    setForm((current) => ({ ...current, attachment: null }));
    setTouched((current) => ({ ...current, attachment: true }));
    setFileError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(allTouchedState);

    if (!isFormValid || !selectedFacility || !form.attachment || !form.result || !form.inspectionType) {
      setSubmitError(
        errors.hasInspectionRecord ??
          'Vui lòng hoàn thành đầy đủ các trường bắt buộc trước khi lưu báo cáo.'
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await onSubmit?.({
        facilityId: selectedFacility.id,
        facilityName: selectedFacility.name,
        district: selectedFacility.district,
        inspectionDate: form.inspectionDate,
        inspectionType: form.inspectionType,
        content: form.content.trim(),
        comment: form.comment.trim(),
        result: form.result,
        score: Number(form.score),
        attachment: form.attachment,
        fileName: form.attachment.name,
        hasInspectionRecord: form.hasInspectionRecord,
      });
    } catch {
      setSubmitError('Không thể lưu báo cáo lúc này. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">Tạo báo cáo thanh tra</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Hoàn thiện đầy đủ thông tin, nội dung và kết quả trước khi gửi báo cáo.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hủy
        </button>
      </div>

      {!form.hasInspectionRecord && (
        <AlertBanner
          type="danger"
          title="Vui lòng lập và lưu biên bản kiểm tra trước khi báo cáo"
          className="mb-4"
        />
      )}

      {submitError && <AlertBanner type="danger" title={submitError} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <ReportInfoSection
          reportId={reportId}
          businessOptions={businessOptions}
          form={form}
          errors={errors}
          showError={showError}
          onFieldBlur={handleFieldBlur}
          onFieldChange={handleFieldChange}
        />

        <ReportContentSection
          form={form}
          errors={errors}
          showError={showError}
          onFieldBlur={handleFieldBlur}
          onFieldChange={handleFieldChange}
        />

        <ReportCommentSection
          form={form}
          errors={errors}
          showError={showError}
          onFieldBlur={handleFieldBlur}
          onFieldChange={handleFieldChange}
        />

        <ResultSection
          form={form}
          errors={errors}
          showError={showError}
          onFieldBlur={handleFieldBlur}
          onFieldChange={handleFieldChange}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)]">
          <AttachmentSection
            form={form}
            errors={errors}
            showError={showError}
            onFieldBlur={handleFieldBlur}
            inputRef={fileInputRef}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
          />

          <ConfirmationSection
            checked={form.hasInspectionRecord}
            error={errors.hasInspectionRecord}
            showError={showError('hasInspectionRecord')}
            onBlur={() => handleFieldBlur('hasInspectionRecord')}
            onChange={(checked) => handleFieldChange('hasInspectionRecord', checked)}
          />
        </div>

        <div className="overflow-hidden border border-slate-300 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-t border-slate-300 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-sky-200 bg-sky-50 text-sky-600">
                <FiFileText size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Trạng thái biểu mẫu</p>
                <p className="mt-1 text-[13px] text-slate-500">
                  {isFormValid
                    ? 'Biểu mẫu đã hợp lệ và sẵn sàng lưu.'
                    : 'Hoàn thiện các trường bắt buộc để bật nút gửi báo cáo.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
