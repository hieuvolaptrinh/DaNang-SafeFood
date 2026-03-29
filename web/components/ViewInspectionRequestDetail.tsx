"use client";

import type { ReactNode } from "react";
import Badge from "@/components/Badge";
import TableCard from "@/components/TableCard";
import { Input } from "@/components/ui/input";

export interface ViewInspectionRequestData {
  id: string;
  facilityName: string;
  address: string;
  type: string;
  createdAt: string;
  inspector: string;
  status: "pending" | "processing" | "completed";
  samples: string[];
  criteria?: string[];
  notes?: string;
  fileName?: string;
}

interface ViewInspectionRequestDetailProps {
  data: ViewInspectionRequestData;
  onBack: () => void;
}

const STATUS_CONFIG: Record<
  ViewInspectionRequestData["status"],
  { label: string; badgeVariant: "pending" | "in-progress" | "resolved" }
> = {
  pending: { label: "Chờ xử lý", badgeVariant: "pending" },
  processing: { label: "Đang thực hiện", badgeVariant: "in-progress" },
  completed: { label: "Hoàn thành", badgeVariant: "resolved" },
};

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

function ReadOnlyField({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        value={value}
        readOnly
        className="h-10 border-slate-200 bg-slate-50 px-3 text-slate-700"
      />
    </div>
  );
}

function ReadOnlyList({
  label,
  items,
  emptyText,
}: {
  label: string;
  items: string[];
  emptyText: string;
}) {
  const values = items.length > 0 ? items : [emptyText];

  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="space-y-2">
        {values.map((item, index) => (
          <Input
            key={`${label}-${index}`}
            value={item}
            readOnly
            className="h-10 border-slate-200 bg-slate-50 px-3 text-slate-700"
          />
        ))}
      </div>
    </div>
  );
}

export default function ViewInspectionRequestDetail({
  data,
  onBack,
}: ViewInspectionRequestDetailProps) {
  const statusConfig = STATUS_CONFIG[data.status];

  return (
    <TableCard
      title="Xem chi tiết đơn yêu cầu kiểm nghiệm"
      actions={
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Quay lại
        </button>
      }
    >
      <div className="space-y-6 p-5">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <SectionTitle>1. Thông tin cơ sở</SectionTitle>
            <p className="mt-1 text-sm text-slate-500">
              Thông tin cơ sở được hiển thị ở chế độ chỉ đọc.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ReadOnlyField
              id="facilityName"
              label="Tên cơ sở"
              value={data.facilityName}
            />
            <ReadOnlyField id="address" label="Địa chỉ" value={data.address} />
            <ReadOnlyField id="type" label="Loại hình" value={data.type} />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <SectionTitle>2. Thông tin yêu cầu kiểm nghiệm</SectionTitle>
            <p className="mt-1 text-sm text-slate-500">
              Bao gồm mã yêu cầu, ngày gửi và thanh tra viên phụ trách.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReadOnlyField id="requestId" label="Mã yêu cầu" value={data.id} />
            <ReadOnlyField
              id="createdAt"
              label="Ngày gửi"
              value={data.createdAt}
            />
            <ReadOnlyField
              id="inspector"
              label="Thanh tra viên"
              value={data.inspector}
            />
            <div className="space-y-2">
              <FieldLabel>Trạng thái</FieldLabel>
              <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3">
                <Badge
                  variant={statusConfig.badgeVariant}
                  label={statusConfig.label}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <SectionTitle>3. Nội dung kiểm nghiệm</SectionTitle>
            <p className="mt-1 text-sm text-slate-500">
              Danh sách mẫu gửi kiểm nghiệm và các chỉ tiêu liên quan.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ReadOnlyList
              label="Danh sách mẫu gửi kiểm nghiệm"
              items={data.samples}
              emptyText="Chưa có thông tin mẫu gửi kiểm nghiệm"
            />
            <ReadOnlyList
              label="Chỉ tiêu kiểm nghiệm"
              items={data.criteria ?? []}
              emptyText="Không có chỉ tiêu kiểm nghiệm"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <SectionTitle>4. Ghi chú</SectionTitle>
            <p className="mt-1 text-sm text-slate-500">
              Nội dung ghi chú được lưu kèm theo yêu cầu.
            </p>
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="notes">Nội dung ghi chú</FieldLabel>
            <textarea
              id="notes"
              value={data.notes ?? "Không có ghi chú"}
              readOnly
              className="min-h-[120px] w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <SectionTitle>5. Tệp đính kèm</SectionTitle>
            <p className="mt-1 text-sm text-slate-500">
              Hiển thị tên tệp đính kèm ở chế độ chỉ đọc.
            </p>
          </div>

          <ReadOnlyField
            id="fileName"
            label="Tên tệp"
            value={data.fileName ?? "Không có tệp đính kèm"}
          />
        </section>
      </div>
    </TableCard>
  );
}
