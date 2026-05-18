'use client';

import type { ReactNode } from 'react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { Inspection } from '@/data/mockData';
import AlertBanner from '@/components/AlertBanner';
import TableCard from '@/components/TableCard';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type ChecklistResult = 'pass' | 'fail' | '';
type ViolationStatus = 'none' | 'has' | '';
type ConclusionStatus = 'pass' | 'fail' | '';

interface CreateInspectionFormProps {
  onCancel: () => void;
  onSuccess: (record: InspectionFormResult) => void;
  mode?: 'create' | 'edit' | 'view';
  data?: Partial<InspectionFormState>;
  recordId?: string;
}

export interface InspectionFormResult extends Omit<InspectionFormState, 'checklist' | 'violationStatus' | 'conclusion'> {
  id: string;
  business: string;
  type: string;
  inspector: string;
  date: string;
  result: 'pass' | 'fail';
  score: number;
  checklist: Record<string, 'pass' | 'fail'>;
  violationStatus: 'none' | 'has';
  conclusion: 'pass' | 'fail';
}

interface ChecklistItem {
  key: string;
  label: string;
}

interface ChecklistGroup {
  title: string;
  items: ChecklistItem[];
}

interface InspectionFormState {
  facilityId: string;
  businessName: string;
  address: string;
  phone: string;
  owner: string;
  businessType: string;
  inspectionTime: string;
  businessLicense: string;
  foodSafetyCertificate: string;
  healthCertificate: string;
  trainingCertificate: string;
  checklist: Record<string, ChecklistResult>;
  violationStatus: ViolationStatus;
  violationDescription: string;
  conclusion: ConclusionStatus;
  generalComment: string;
  actionMeasure: string;
  recommendation: string;
}

const businessTypeOptions = [
  'Nhà hàng',
  'Quán ăn',
  'Bếp ăn tập thể',
  'Cơ sở chế biến thực phẩm',
  'Cửa hàng thực phẩm',
  'Thức ăn đường phố',
];

const mockFacilities = [
  { id: 'CS001', name: 'Nhà hàng Biển Đông', license: '001', address: 'Hải Châu', owner: 'Nguyễn Văn A', phone: '0905123456', type: 'Nhà hàng' },
  { id: 'CS002', name: 'Nhà hàng Biển Đông 2', license: '002', address: 'Sơn Trà', owner: 'Trần Thị B', phone: '0905987654', type: 'Nhà hàng' },
  { id: 'CS003', name: 'Quán ăn Cô Ba', license: '003', address: 'Thanh Khê', owner: 'Lê Văn C', phone: '0905111222', type: 'Quán ăn' },
];

const checklistGroups: ChecklistGroup[] = [
  {
    title: 'Nhóm 1: Cơ sở vật chất',
    items: [
      { key: 'cleanProcessingArea', label: 'Khu chế biến sạch sẽ' },
      { key: 'separateRawCookedArea', label: 'Phân khu sống/chín' },
      { key: 'drainageSystem', label: 'Hệ thống thoát nước' },
      { key: 'noInsects', label: 'Không có côn trùng' },
    ],
  },
  {
    title: 'Nhóm 2: Trang thiết bị',
    items: [
      { key: 'cleanUtensils', label: 'Dụng cụ sạch' },
      { key: 'storageCabinet', label: 'Tủ bảo quản' },
      { key: 'coveredFood', label: 'Che đậy thực phẩm' },
      { key: 'separateUtensils', label: 'Dụng cụ riêng sống/chín' },
    ],
  },
  {
    title: 'Nhóm 3: Nguyên liệu',
    items: [
      { key: 'clearOrigin', label: 'Nguồn gốc rõ ràng' },
      { key: 'hasInvoice', label: 'Có hóa đơn' },
      { key: 'notExpired', label: 'Không hết hạn' },
      { key: 'hasSampleStorage', label: 'Lưu mẫu' },
    ],
  },
  {
    title: 'Nhóm 4: Nhân viên',
    items: [
      { key: 'healthCheck', label: 'Có khám sức khỏe' },
      { key: 'foodSafetyTraining', label: 'Có tập huấn ATTP' },
      { key: 'wearProtection', label: 'Mặc bảo hộ' },
      { key: 'noInfectiousDisease', label: 'Không mắc bệnh' },
    ],
  },
  {
    title: 'Nhóm 5: Quy trình',
    items: [
      { key: 'properProcessing', label: 'Chế biến đúng' },
      { key: 'properStorage', label: 'Bảo quản đúng' },
      { key: 'noCrossContamination', label: 'Không lẫn sống/chín' },
      { key: 'postProcessingCleanup', label: 'Vệ sinh sau chế biến' },
    ],
  },
];

function createInitialChecklist() {
  return checklistGroups.reduce<Record<string, ChecklistResult>>((accumulator, group) => {
    group.items.forEach((item) => {
      accumulator[item.key] = '';
    });
    return accumulator;
  }, {});
}

function createInitialFormState(): InspectionFormState {
  return {
    facilityId: '',
    businessName: '',
    address: '',
    phone: '',
    owner: '',
    businessType: '',
    inspectionTime: '',
    businessLicense: '',
    foodSafetyCertificate: '',
    healthCertificate: '',
    trainingCertificate: '',
    checklist: createInitialChecklist(),
    violationStatus: '',
    violationDescription: '',
    conclusion: '',
    generalComment: '',
    actionMeasure: '',
    recommendation: '',
  };
}

function buildValidation(state: InspectionFormState) {
  const fieldErrors: Partial<Record<keyof InspectionFormState, string>> = {};
  const requiredFields: Array<keyof InspectionFormState> = [
    'facilityId',
    'inspectionTime',
    'violationStatus',
    'conclusion',
    'generalComment',
    'actionMeasure',
    'recommendation',
  ];

  requiredFields.forEach((field) => {
    const value = state[field];
    if (typeof value === 'string' && value.trim().length === 0) {
      fieldErrors[field] = 'Trường này là bắt buộc';
    }
  });

  if (state.violationStatus === 'has' && state.violationDescription.trim().length === 0) {
    fieldErrors.violationDescription = 'Vui lòng mô tả vi phạm';
  }

  const missingChecklistKeys = checklistGroups.flatMap((group) =>
    group.items.filter((item) => !state.checklist[item.key]).map((item) => item.key)
  );

  return {
    fieldErrors,
    missingChecklistKeys,
    isValid: Object.keys(fieldErrors).length === 0 && missingChecklistKeys.length === 0,
  };
}

function saveDraft(state: InspectionFormState) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    'inspection-record-draft',
    JSON.stringify({
      savedAt: new Date().toISOString(),
      data: state,
    })
  );
}

function mockCreateInspectionRecord(state: InspectionFormState, recordId?: string) {
  return new Promise<Inspection>((resolve, reject) => {
    window.setTimeout(() => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        reject(new Error('NETWORK_ERROR'));
        return;
      }

      const totalChecklistItems = checklistGroups.reduce((sum, group) => sum + group.items.length, 0);
      const passedItems = Object.values(state.checklist).filter((value) => value === 'pass').length;
      const score = Math.round((passedItems / totalChecklistItems) * 100);

      resolve({
        id: recordId ?? `INS-${Date.now().toString().slice(-6)}`,
        business: state.businessName.trim(),
        type: 'Kiểm tra ATVSTP',
        inspector: 'Thanh tra viên phụ trách',
        date: new Date(state.inspectionTime).toLocaleDateString('vi-VN'),
        result: state.conclusion === 'pass' ? 'pass' : 'fail',
        score,
      });
    }, 1200);
  });
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-800">
      {children}
    </label>
  );
}

export default function CreateInspectionForm({
  onCancel,
  onSuccess,
  mode = 'create',
  data,
  recordId,
}: CreateInspectionFormProps) {
  const [form, setForm] = useState<InspectionFormState>(() => createInitialFormState());
  const [submitError, setSubmitError] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';

  useEffect(() => {
    setForm({ ...createInitialFormState(), ...data });
    setShowValidation(false);
    setSubmitError('');
  }, [data, mode]);

  const validation = useMemo(() => buildValidation(form), [form]);
  const shouldDisableSubmit = isSubmitting || (showValidation && !validation.isValid);

  const updateField = <K extends Exclude<keyof InspectionFormState, 'checklist'>>(
    key: K,
    value: InspectionFormState[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSubmitError('');
  };

  const updateChecklist = (key: string, value: ChecklistResult) => {
    setForm((current) => ({
      ...current,
      checklist: {
        ...current.checklist,
        [key]: value,
      },
    }));
    setSubmitError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isViewMode) {
      return;
    }

    setShowValidation(true);

    if (!validation.isValid) {
      setSubmitError(
        validation.missingChecklistKeys.length > 0
          ? 'Vui lòng đánh giá đầy đủ tất cả các mục checklist bắt buộc.'
          : 'Vui lòng nhập đầy đủ các trường bắt buộc trước khi lưu biên bản.'
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const saved = await mockCreateInspectionRecord(form, recordId);
      const payload: InspectionFormResult = {
        ...form,
        id: saved.id,
        business: saved.business,
        type: saved.type,
        inspector: saved.inspector,
        date: saved.date,
        result: saved.result,
        score: saved.score,
      };
      onSuccess(payload);
    } catch {
      saveDraft(form);
      setSubmitError('Mất kết nối mạng, dữ liệu đã được lưu nháp');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: keyof InspectionFormState) =>
    showValidation ? validation.fieldErrors[field] : undefined;

  return (
    <div>
      {submitError && (
        <AlertBanner
          type={submitError.includes('lưu nháp') ? 'warning' : 'danger'}
          title={submitError}
          className="mb-4"
        />
      )}

      <TableCard title={isViewMode ? 'Xem hồ sơ kiểm tra ATVSTP' : isEditMode ? 'Chỉnh sửa hồ sơ kiểm tra ATVSTP' : 'Tạo hồ sơ kiểm tra ATVSTP'}>
        <form onSubmit={handleSubmit} className="space-y-6 p-5" noValidate>
          <section className="space-y-4 border border-slate-300 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Thông tin cơ sở</h2>
              <p className="mt-1 text-sm text-slate-500">Tìm kiếm và chọn cơ sở kinh doanh đã được cấp phép.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <FieldLabel htmlFor="facilitySearch">Tìm kiếm cơ sở kinh doanh</FieldLabel>
                <Input
                  id="facilitySearch"
                  list="facilities"
                  placeholder="Gõ để tìm kiếm..."
                  defaultValue={
                    isViewMode || isEditMode
                      ? `${form.businessName}` // Just a fallback for view mode
                      : ''
                  }
                  disabled={isViewMode || isEditMode}
                  onChange={(e) => {
                    const val = e.target.value;
                    const found = mockFacilities.find(
                      (f) => `${f.name} - Số GP: ${f.license} - Địa chỉ: ${f.address}` === val
                    );
                    if (found) {
                      updateField('facilityId', found.id);
                      updateField('businessName', found.name);
                      updateField('owner', found.owner);
                      updateField('address', found.address);
                      updateField('phone', found.phone);
                      updateField('businessType', found.type);
                      updateField('businessLicense', found.license);
                    } else {
                      updateField('facilityId', '');
                      updateField('businessName', '');
                      updateField('owner', '');
                      updateField('address', '');
                      updateField('phone', '');
                      updateField('businessType', '');
                      updateField('businessLicense', '');
                    }
                  }}
                  className={cn(
                    'rounded-none border-slate-300 bg-white',
                    getFieldError('facilityId') ? 'border-red-500 ring-2 ring-red-100' : 'focus:border-sky-600'
                  )}
                />
                <datalist id="facilities">
                  {mockFacilities.map((f) => (
                    <option key={f.id} value={`${f.name} - Số GP: ${f.license} - Địa chỉ: ${f.address}`} />
                  ))}
                </datalist>
                {getFieldError('facilityId') && (
                  <p className="text-sm text-red-600">Vui lòng chọn cơ sở hợp lệ từ danh sách</p>
                )}
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="businessName">Tên cơ sở</FieldLabel>
                <Input id="businessName" value={form.businessName} disabled className="rounded-none border-slate-300 bg-slate-50 text-slate-500" />
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="owner">Chủ cơ sở</FieldLabel>
                <Input id="owner" value={form.owner} disabled className="rounded-none border-slate-300 bg-slate-50 text-slate-500" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <FieldLabel htmlFor="address">Địa chỉ</FieldLabel>
                <Input id="address" value={form.address} disabled className="rounded-none border-slate-300 bg-slate-50 text-slate-500" />
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>
                <Input id="phone" value={form.phone} disabled className="rounded-none border-slate-300 bg-slate-50 text-slate-500" />
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="businessType">Loại hình kinh doanh</FieldLabel>
                <Input id="businessType" value={form.businessType} disabled className="rounded-none border-slate-300 bg-slate-50 text-slate-500" />
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="inspectionTime">Thời gian kiểm tra</FieldLabel>
                <Input
                  id="inspectionTime"
                  type="datetime-local"
                  value={form.inspectionTime}
                  onChange={(event) => updateField('inspectionTime', event.target.value)}
                  aria-invalid={Boolean(getFieldError('inspectionTime'))}
                  className="rounded-none border-slate-300 bg-white focus:border-sky-600"
                />
                {getFieldError('inspectionTime') && (
                  <p className="text-sm text-red-600">{getFieldError('inspectionTime')}</p>
                )}
              </div>
            </div>
          </section>

          <section
            className={cn(
              'space-y-4 border bg-white p-5 shadow-sm',
              showValidation && validation.missingChecklistKeys.length > 0 ? 'border-red-300' : 'border-slate-300'
            )}
          >
            <div>
              <h2 className="text-base font-bold text-slate-900">{isViewMode ? '3. Checklist đánh giá' : '2. Checklist đánh giá'}</h2>
              <p className="mt-1 text-sm text-slate-500">Mỗi tiêu chí phải được chọn Đạt hoặc Không đạt.</p>
            </div>

            {showValidation && validation.missingChecklistKeys.length > 0 && (
              <p className="text-sm font-medium text-red-600">
                Vui lòng hoàn thành tất cả các mục checklist trước khi lưu biên bản.
              </p>
            )}

            <div className="space-y-4">
              {checklistGroups.map((group) => (
                <div key={group.title} className="border border-slate-300 bg-slate-50 p-4">
                  <h3 className="text-sm font-bold text-slate-800">{group.title}</h3>
                  <div className="mt-3 space-y-3">
                    {group.items.map((item) => {
                      const isMissing = showValidation && validation.missingChecklistKeys.includes(item.key);

                      return (
                        <div
                          key={item.key}
                          className={cn(
                            'grid gap-3 border px-4 py-3 md:grid-cols-[1fr_auto]',
                            isMissing ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
                          )}
                        >
                          <span className="text-sm font-medium text-slate-800">{item.label}</span>
                          <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-2 text-sm text-slate-700">
                              <input
                                type="radio"
                                name={item.key}
                                checked={form.checklist[item.key] === 'pass'}
                                onChange={() => updateChecklist(item.key, 'pass')}
                                className="h-4 w-4 border-slate-300 text-blue-600"
                              />
                              Đạt
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-700">
                              <input
                                type="radio"
                                name={item.key}
                                checked={form.checklist[item.key] === 'fail'}
                                onChange={() => updateChecklist(item.key, 'fail')}
                                className="h-4 w-4 border-slate-300 text-blue-600"
                              />
                              Không đạt
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {isViewMode && (
            <section className="space-y-4 border border-slate-300 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-base font-bold text-slate-900">2. Hồ sơ pháp lý</h2>
                <p className="mt-1 text-sm text-slate-500">Tình trạng giấy tờ pháp lý của cơ sở.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Giấy phép kinh doanh', value: form.businessLicense || 'Chưa cập nhật' },
                  { label: 'Giấy chứng nhận ATTP', value: form.foodSafetyCertificate || 'Chưa cập nhật' },
                  { label: 'Giấy khám sức khỏe', value: form.healthCertificate || 'Chưa cập nhật' },
                  { label: 'Giấy tập huấn ATTP', value: form.trainingCertificate || 'Chưa cập nhật' },
                ].map((item) => (
                  <div key={item.label} className="border border-slate-300 bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-4 border border-slate-300 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900">{isViewMode ? '4. Vi phạm' : '3. Vi phạm'}</h2>
              <p className="mt-1 text-sm text-slate-500">Xác định tình trạng vi phạm và mô tả chi tiết nếu có.</p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="violationStatus"
                    checked={form.violationStatus === 'none'}
                    onChange={() => updateField('violationStatus', 'none')}
                    className="h-4 w-4 border-slate-300 text-blue-600"
                  />
                  Không có vi phạm
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="violationStatus"
                    checked={form.violationStatus === 'has'}
                    onChange={() => updateField('violationStatus', 'has')}
                    className="h-4 w-4 border-slate-300 text-blue-600"
                  />
                  Có vi phạm
                </label>
              </div>
              {getFieldError('violationStatus') && (
                <p className="text-sm text-red-600">{getFieldError('violationStatus')}</p>
              )}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="violationDescription">Mô tả vi phạm</FieldLabel>
              <textarea
                id="violationDescription"
                rows={4}
                value={form.violationDescription}
                onChange={(event) => updateField('violationDescription', event.target.value)}
                placeholder="Nhập mô tả vi phạm nếu có..."
                className={cn(
                  'w-full border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition',
                  getFieldError('violationDescription')
                    ? 'border-red-500 ring-2 ring-red-100'
                    : 'border-slate-300 focus:border-sky-600'
                )}
              />
              {getFieldError('violationDescription') && (
                <p className="text-sm text-red-600">{getFieldError('violationDescription')}</p>
              )}
            </div>
          </section>

          <section className="space-y-4 border border-slate-300 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900">{isViewMode ? '5. Kết luận' : '4. Kết luận'}</h2>
              <p className="mt-1 text-sm text-slate-500">Tổng hợp kết quả và nhận xét chung cho biên bản.</p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="conclusion"
                    checked={form.conclusion === 'pass'}
                    onChange={() => updateField('conclusion', 'pass')}
                    className="h-4 w-4 border-slate-300 text-blue-600"
                  />
                  Đạt
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="conclusion"
                    checked={form.conclusion === 'fail'}
                    onChange={() => updateField('conclusion', 'fail')}
                    className="h-4 w-4 border-slate-300 text-blue-600"
                  />
                  Không đạt
                </label>
              </div>
              {getFieldError('conclusion') && <p className="text-sm text-red-600">{getFieldError('conclusion')}</p>}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="generalComment">Nhận xét chung</FieldLabel>
              <textarea
                id="generalComment"
                rows={4}
                value={form.generalComment}
                onChange={(event) => updateField('generalComment', event.target.value)}
                placeholder="Nhập nhận xét chung về tình trạng ATVS thực phẩm..."
                className={cn(
                  'w-full border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition',
                  getFieldError('generalComment')
                    ? 'border-red-500 ring-2 ring-red-100'
                    : 'border-slate-300 focus:border-sky-600'
                )}
              />
              {getFieldError('generalComment') && (
                <p className="text-sm text-red-600">{getFieldError('generalComment')}</p>
              )}
            </div>
          </section>

          <section className="space-y-4 border border-slate-300 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900">{isViewMode ? '6. Kiến nghị' : '5. Kiến nghị'}</h2>
              <p className="mt-1 text-sm text-slate-500">Đề xuất biện pháp xử lý và kiến nghị tiếp theo.</p>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="actionMeasure">Biện pháp xử lý</FieldLabel>
              <textarea
                id="actionMeasure"
                rows={4}
                value={form.actionMeasure}
                onChange={(event) => updateField('actionMeasure', event.target.value)}
                placeholder="Nhập biện pháp xử lý..."
                className={cn(
                  'w-full border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition',
                  getFieldError('actionMeasure')
                    ? 'border-red-500 ring-2 ring-red-100'
                    : 'border-slate-300 focus:border-sky-600'
                )}
              />
              {getFieldError('actionMeasure') && (
                <p className="text-sm text-red-600">{getFieldError('actionMeasure')}</p>
              )}
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="recommendation">Kiến nghị</FieldLabel>
              <textarea
                id="recommendation"
                rows={4}
                value={form.recommendation}
                onChange={(event) => updateField('recommendation', event.target.value)}
                placeholder="Nhập kiến nghị..."
                className={cn(
                  'w-full border bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition',
                  getFieldError('recommendation')
                    ? 'border-red-500 ring-2 ring-red-100'
                    : 'border-slate-300 focus:border-sky-600'
                )}
              />
              {getFieldError('recommendation') && (
                <p className="text-sm text-red-600">{getFieldError('recommendation')}</p>
              )}
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 border-t border-slate-300 pt-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isViewMode ? 'Quay lại' : 'Hủy'}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                disabled={shouldDisableSubmit}
                className="border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
              >
                {isSubmitting
                  ? isEditMode
                    ? 'Đang cập nhật...'
                    : 'Đang lưu...'
                  : isEditMode
                    ? 'Cập nhật biên bản'
                    : 'Lưu biên bản'}
              </button>
            )}
          </div>
        </form>
      </TableCard>
    </div>
  );
}
