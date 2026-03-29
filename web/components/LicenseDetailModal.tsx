'use client';

import { FileImageIcon, FileTextIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export type LicenseStatus = 'valid' | 'expired' | 'revoked';

export interface LicenseSummary {
  id: string;
  businessName: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: LicenseStatus;
  district: string;
}

export interface LicenseDetailData extends LicenseSummary {
  evidenceKind: 'image' | 'file';
  evidenceName: string;
  evidenceDescription: string;
}

export interface SelectedLicenseRecord {
  summary: LicenseSummary;
  detail: LicenseDetailData | null;
}

interface LicenseDetailModalProps {
  open: boolean;
  loading: boolean;
  selectedLicense: SelectedLicenseRecord | null;
  onOpenChange: (open: boolean) => void;
}

const STATUS_BADGE_CLASSNAME: Record<LicenseStatus, string> = {
  valid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  expired: 'border-slate-200 bg-slate-100 text-slate-600',
  revoked: 'border-red-200 bg-red-50 text-red-700',
};

const STATUS_LABEL: Record<LicenseStatus, string> = {
  valid: 'Còn hiệu lực',
  expired: 'Hết hạn',
  revoked: 'Đã thu hồi',
};

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export default function LicenseDetailModal({
  open,
  loading,
  selectedLicense,
  onOpenChange,
}: LicenseDetailModalProps) {
  const detail = selectedLicense?.detail;
  const summary = selectedLicense?.summary;
  const status = detail?.status ?? summary?.status;
  const EvidenceIcon = detail?.evidenceKind === 'file' ? FileTextIcon : FileImageIcon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-[calc(100%-1.5rem)] flex-col overflow-hidden border border-slate-200 bg-white p-0 sm:max-w-2xl">
        <div className="shrink-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-4 py-4 text-white sm:px-6 sm:py-5">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-xl font-bold text-white">
              Xem giấy phép kinh doanh
            </DialogTitle>
            <DialogDescription className="text-sm text-white/80">
              {summary
                ? `Chi tiết giấy phép của ${summary.businessName}`
                : 'Chi tiết giấy phép kinh doanh của cơ sở'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 overscroll-contain scroll-smooth sm:px-6 sm:py-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2">
          {loading ? (
            <div className="flex min-h-52 items-center justify-center">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-600">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                Đang tải thông tin giấy phép...
              </div>
            </div>
          ) : summary && !detail ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-medium text-amber-800">
              Cơ sở này chưa cập nhật hoặc không có dữ liệu giấy phép
            </div>
          ) : detail ? (
            <div className="grid gap-5 pb-2">
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-slate-900">Thông tin giấy phép</h3>
                  {status ? (
                    <Badge
                      variant="outline"
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold',
                        STATUS_BADGE_CLASSNAME[status]
                      )}
                    >
                      {STATUS_LABEL[status]}
                    </Badge>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailItem label="Mã giấy phép" value={detail.id} />
                  <DetailItem label="Tên cơ sở" value={detail.businessName} />
                  <DetailItem label="Loại giấy phép" value={detail.type} />
                  <DetailItem label="Ngày cấp" value={detail.issueDate} />
                  <DetailItem label="Ngày hết hạn" value={detail.expiryDate} />
                  <DetailItem label="Trạng thái" value={STATUS_LABEL[detail.status]} />
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-slate-900">Minh chứng</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Xem trước minh chứng giấy phép bằng dữ liệu mô phỏng.
                  </p>
                </div>

                <div className="rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-5">
                  <div className="flex min-h-56 items-center justify-center rounded-2xl border border-white/80 bg-white/90 p-6 shadow-inner">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                        <EvidenceIcon className="h-7 w-7" />
                      </div>
                      <p className="text-base font-semibold text-slate-800">{detail.evidenceName}</p>
                      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                        {detail.evidenceDescription}
                      </p>
                      <span className="mt-4 inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        Preview mock
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </div>

        <DialogFooter className="shrink-0 border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
