"use client";

import {
  type ChangeEvent,
  type ElementType,
  type ReactNode,
  useState,
} from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiDownload,
  FiEdit3,
  FiEye,
  FiFileText,
  FiPlus,
} from "react-icons/fi";
import {
  LuBuilding2,
  LuClipboardList,
  LuSearch,
  LuShieldCheck,
  LuTestTube,
} from "react-icons/lu";
import { useRole } from "@/lib/RoleContext";
import Badge from "@/components/Badge";
import CreateInspectionRequestForm from "@/components/CreateInspectionRequestForm";
import DataTable, { type Column } from "@/components/DataTable";
import TableCard, {
  FilterSelect,
  Pagination,
  SearchInput,
} from "@/components/TableCard";

export interface TestRequest {
  id: string;
  business: string;
  sampleType: string;
  requestDate: string;
  deadline: string;
  status: "pending" | "processing" | "completed";
  lab: string;
  result?: string;
  reason?: string;
  stampedFile?: string;
  sampleId?: string;
  collectedDate?: string;
  criteria?: string[];
  requestContent?: string;
}

const mockTestRequests: TestRequest[] = [
  {
    id: "YC-2025001",
    business: "Nhà hàng Hải Sản Biển Xanh",
    sampleType: "Mẫu thực phẩm tươi",
    requestDate: "23/03/2025",
    deadline: "30/03/2025",
    status: "processing",
    lab: "Trung tâm Kiểm nghiệm Đà Nẵng",
    result: "Đạt tiêu chuẩn",
    sampleId: "M-2025-001",
    collectedDate: "22/03/2025",
    criteria: ["Vi sinh", "Hóa học"],
    requestContent:
      "Kiểm nghiệm mẫu hải sản tươi sống, đảm bảo không nhiễm vi khuẩn E.coli và Salmonella theo QCVN 8-3:2012/BYT.",
  },
  {
    id: "YC-2025002",
    business: "Cửa hàng Thực phẩm Sạch Organic",
    sampleType: "Mẫu rau hữu cơ",
    requestDate: "24/03/2025",
    deadline: "02/04/2025",
    status: "pending",
    lab: "Lab Việt Nam",
    sampleId: "M-2025-002",
    collectedDate: "23/03/2025",
    criteria: ["Kim loại nặng", "Hóa học", "Cảm quan"],
    requestContent:
      "Kiểm tra dư lượng thuốc bảo vệ thực vật và kim loại nặng trong rau hữu cơ theo tiêu chuẩn hữu cơ Việt Nam.",
  },
  {
    id: "YC-2025003",
    business: "Siêu thị Mini Mart Đà Nẵng",
    sampleType: "Mẫu nước đá",
    requestDate: "20/03/2025",
    deadline: "28/03/2025",
    status: "completed",
    lab: "Trung tâm Kiểm nghiệm Đà Nẵng",
    result: "Không đạt",
    reason: "Vi phạm giới hạn vi sinh vật",
    sampleId: "M-2025-003",
    collectedDate: "19/03/2025",
    criteria: ["Vi sinh", "Cảm quan"],
    requestContent:
      "Kiểm tra chỉ tiêu vi sinh và cảm quan của mẫu nước đá dùng cho thực phẩm tại siêu thị.",
  },
];

const STATUS_CONFIG: Record<
  TestRequest["status"],
  { label: string; variant: "pending" | "in-progress" | "resolved" }
> = {
  pending: { label: "Chờ xử lý", variant: "pending" },
  processing: { label: "Đang thực hiện", variant: "in-progress" },
  completed: { label: "Hoàn thành", variant: "resolved" },
};

const DETAIL_STATUS_CONFIG: Record<
  TestRequest["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Chờ xử lý",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  processing: {
    label: "Đang thực hiện",
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  completed: {
    label: "Hoàn thành",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};

function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: number;
  icon: ElementType;
  iconClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>
          <p className="text-[30px] font-black leading-none text-slate-900">
            {value}
          </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClassName}`}>
          <Icon className="text-[20px]" />
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: ElementType;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 text-sky-700">
          <Icon className="text-[18px]" />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-[13px] text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function DetailField({
  label,
  value,
  spanClassName,
}: {
  label: string;
  value: ReactNode;
  spanClassName?: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 ${spanClassName ?? ""}`}>
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <div className="text-[13px] font-semibold leading-6 text-slate-800">
        {value}
      </div>
    </div>
  );
}

export default function YeuCauPage() {
  const { role } = useRole();
  const [mode, setMode] = useState<"list" | "create">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState<TestRequest[]>(mockTestRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null);
  const [modalStatus, setModalStatus] = useState<TestRequest["status"]>("pending");
  const [resultStatus, setResultStatus] = useState<"Đạt" | "Không đạt">("Đạt");
  const [reason, setReason] = useState("");
  const [stampedFileName, setStampedFileName] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailNotFound, setDetailNotFound] = useState(false);
  const [detailRequest, setDetailRequest] = useState<TestRequest | null>(null);

  const canCreateRequest = role === "INSPECTOR";
  const canManageResult = role === "TESTER";
  const isDetailView = detailLoading || detailNotFound || detailRequest !== null;

  const openDetail = (request: TestRequest) => {
    setDetailLoading(true);
    setDetailNotFound(false);
    setDetailRequest(null);

    window.setTimeout(() => {
      setDetailRequest(request);
      setDetailNotFound(false);
      setDetailLoading(false);
    }, 300);
  };

  const closeDetail = () => {
    setDetailLoading(false);
    setDetailNotFound(false);
    setDetailRequest(null);
  };

  const filtered = data.filter((request) => {
    const matchSearch =
      !search ||
      request.business.toLowerCase().includes(search.toLowerCase()) ||
      request.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || request.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openResultModal = (request: TestRequest) => {
    setSelectedRequest(request);
    setModalStatus(request.status);
    setResultStatus(request.result?.includes("Không đạt") ? "Không đạt" : "Đạt");
    setReason(request.reason || "");
    setStampedFileName("");
    setIsModalOpen(true);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStampedFileName(file.name);
    }
  };

  const saveResult = () => {
    if (!selectedRequest) {
      return;
    }

    const finalResult =
      resultStatus === "Đạt" ? "Đạt tiêu chuẩn" : "Không đạt";
    let nextDetailRequest = detailRequest;

    setData((previous) =>
      previous.map((item) => {
        if (item.id !== selectedRequest.id) {
          return item;
        }

        const updatedItem: TestRequest = {
          ...item,
          status: modalStatus,
          result: finalResult,
          reason: resultStatus === "Không đạt" ? reason.trim() : undefined,
          stampedFile: stampedFileName || item.stampedFile,
        };

        if (detailRequest?.id === item.id) {
          nextDetailRequest = updatedItem;
        }

        return updatedItem;
      })
    );

    if (nextDetailRequest) {
      setDetailRequest(nextDetailRequest);
    }

    setIsModalOpen(false);
    setSelectedRequest(null);
    setReason("");
    setStampedFileName("");
  };

  const isSaveDisabled =
    !stampedFileName || (resultStatus === "Không đạt" && !reason.trim());

  if (mode === "create") {
    return (
      <CreateInspectionRequestForm
        selectedSampleId="SAMPLE-2025-001"
        onCancel={() => setMode("list")}
        onSuccess={(request) => {
          const newRequest: TestRequest = {
            id: request.id,
            business: request.business,
            sampleType: request.sampleType,
            requestDate: request.requestDate,
            deadline: request.deadline,
            status: request.status,
            lab: request.lab,
            requestContent: "",
          };
          setData((previous) => [newRequest, ...previous]);
          setMode("list");
        }}
      />
    );
  }

  const columns: Column<TestRequest>[] = [
    {
      key: "id",
      header: "Mã yêu cầu",
      render: (request) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[12px] font-semibold text-slate-600">
          {request.id}
        </span>
      ),
    },
    {
      key: "business",
      header: "Cơ sở",
      render: (request) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 text-sm font-black text-sky-700">
            {request.business.charAt(0)}
          </div>
          <span className="text-[13px] font-semibold text-slate-800">
            {request.business}
          </span>
        </div>
      ),
    },
    {
      key: "sampleType",
      header: "Loại mẫu",
      render: (request) => (
        <span className="text-[13px] text-slate-600">{request.sampleType}</span>
      ),
    },
    { key: "requestDate", header: "Ngày yêu cầu" },
    { key: "deadline", header: "Hạn hoàn thành" },
    {
      key: "status",
      header: "Trạng thái",
      render: (request) => {
        const config = STATUS_CONFIG[request.status];
        return <Badge variant={config.variant} label={config.label} />;
      },
    },
    {
      key: "lab",
      header: "Phòng lab",
      render: (request) => (
        <span className="text-[13px] text-slate-600">{request.lab}</span>
      ),
    },
    {
      key: "result",
      header: "Kết quả kiểm nghiệm",
      render: (request) => {
        if (!request.result) {
          return <span className="text-slate-400">-</span>;
        }

        return (
          <div className="text-[13px]">
            <div
              className={
                request.result.includes("Không đạt")
                  ? "font-medium text-rose-600"
                  : "font-medium text-emerald-600"
              }
            >
              {request.result}
            </div>
            {request.reason && (
              <div className="mt-0.5 line-clamp-1 text-[12px] text-rose-500">
                {request.reason}
              </div>
            )}
            {request.stampedFile && (
              <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600">
                <FiCheckCircle className="text-[12px]" />
                Có file có dấu mộc
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (request) => (
        <div className="flex gap-2">
          {canManageResult && (
            <button
              onClick={() => openResultModal(request)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-100"
              title="Nhập kết quả kiểm nghiệm"
            >
              <FiEdit3 size={16} />
            </button>
          )}
          <button
            onClick={() => openDetail(request)}
            disabled={detailLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-700 transition-all hover:border-sky-300 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
            title="Xem chi tiết"
          >
            <FiEye size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f2f7f7] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500" />

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-sky-600">
                SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
              </span>
            </div>
            <h1 className="text-[28px] font-black leading-tight tracking-tight text-slate-900">
              Yêu cầu Kiểm nghiệm
            </h1>
            <p className="mt-1 text-[13px] font-medium text-slate-500">
              Quản lý các yêu cầu kiểm nghiệm mẫu từ cơ sở kinh doanh
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50">
              <FiDownload className="text-[15px]" />
              Xuất danh sách
            </button>
            {canCreateRequest && (
              <button
                onClick={() => setMode("create")}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:from-sky-700 hover:to-teal-700"
              >
                <FiPlus className="text-[15px]" />
                Tạo yêu cầu mới
              </button>
            )}
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Tổng yêu cầu"
            value={data.length}
            icon={FiClipboard}
            iconClassName="bg-sky-100 text-sky-700"
          />
          <StatCard
            label="Chờ xử lý"
            value={data.filter((request) => request.status === "pending").length}
            icon={FiClock}
            iconClassName="bg-amber-100 text-amber-700"
          />
          <StatCard
            label="Đang thực hiện"
            value={data.filter((request) => request.status === "processing").length}
            icon={LuTestTube}
            iconClassName="bg-cyan-100 text-cyan-700"
          />
          <StatCard
            label="Hoàn thành"
            value={data.filter((request) => request.status === "completed").length}
            icon={FiCheckCircle}
            iconClassName="bg-emerald-100 text-emerald-700"
          />
        </div>

        {!isDetailView ? (
          <TableCard
            title="Danh sách yêu cầu kiểm nghiệm"
            controls={
              <>
                <SearchInput
                  placeholder="Tìm mã yêu cầu, tên cơ sở..."
                  onChange={setSearch}
                />
                <FilterSelect
                  options={[
                    { value: "", label: "Tất cả trạng thái" },
                    { value: "pending", label: "Chờ xử lý" },
                    { value: "processing", label: "Đang thực hiện" },
                    { value: "completed", label: "Hoàn thành" },
                  ]}
                  onChange={setStatusFilter}
                />
              </>
            }
            footer={
              <Pagination
                info={`Hiển thị ${filtered.length} trong tổng số ${data.length} yêu cầu`}
              />
            }
          >
            <DataTable
              columns={columns}
              data={filtered}
              emptyMessage="Không tìm thấy yêu cầu kiểm nghiệm nào"
            />
          </TableCard>
        ) : (
          <TableCard
            title="Chi tiết yêu cầu kiểm nghiệm"
            actions={
              <button
                type="button"
                onClick={closeDetail}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <FiArrowLeft className="text-[15px]" />
                Quay lại danh sách
              </button>
            }
          >
            {detailLoading ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center gap-4 p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  <LuTestTube className="animate-pulse text-[24px]" />
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-semibold text-slate-800">
                    Đang tải thông tin chi tiết
                  </p>
                  <p className="mt-1 text-[13px] text-slate-500">
                    Hệ thống đang chuẩn bị hồ sơ kiểm nghiệm để hiển thị.
                  </p>
                </div>
              </div>
            ) : detailNotFound ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <LuSearch className="text-[24px]" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-800">
                    Không tìm thấy yêu cầu kiểm nghiệm
                  </p>
                  <p className="mt-1 text-[13px] text-slate-500">
                    Yêu cầu này có thể đã bị xóa hoặc chưa còn khả dụng.
                  </p>
                </div>
              </div>
            ) : detailRequest ? (
              <div className="space-y-6 p-5">
                <section className="overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-teal-50 shadow-sm">
                  <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-sky-200 bg-white px-3 py-1 font-mono text-[12px] font-semibold text-sky-700">
                          {detailRequest.id}
                        </span>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold ${DETAIL_STATUS_CONFIG[detailRequest.status].className}`}
                        >
                          {DETAIL_STATUS_CONFIG[detailRequest.status].label}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-[24px] font-black tracking-tight text-slate-900">
                          {detailRequest.business}
                        </h2>
                        <p className="mt-1 text-[14px] text-slate-600">
                          Yêu cầu kiểm nghiệm cho mẫu{" "}
                          <span className="font-semibold text-slate-800">
                            {detailRequest.sampleType}
                          </span>
                        </p>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <DetailField
                          label="Ngày yêu cầu"
                          value={detailRequest.requestDate}
                        />
                        <DetailField
                          label="Hạn hoàn thành"
                          value={detailRequest.deadline}
                        />
                        <DetailField
                          label="Phòng lab"
                          value={detailRequest.lab}
                        />
                      </div>
                    </div>

                    <div className="grid min-w-[280px] gap-3 rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                          <LuShieldCheck className="text-[18px]" />
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Kết quả hiện tại
                          </p>
                          <p
                            className={`mt-1 text-[14px] font-semibold ${
                              detailRequest.result?.includes("Không đạt")
                                ? "text-rose-600"
                                : detailRequest.result
                                  ? "text-emerald-600"
                                  : "text-slate-500"
                            }`}
                          >
                            {detailRequest.result ?? "Chưa có kết quả"}
                          </p>
                        </div>
                      </div>

                      {detailRequest.reason && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                          <div className="flex items-start gap-2 text-rose-700">
                            <FiAlertCircle className="mt-0.5 flex-shrink-0 text-[14px]" />
                            <p className="text-[13px] font-medium">
                              {detailRequest.reason}
                            </p>
                          </div>
                        </div>
                      )}

                      {detailRequest.stampedFile && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                          <div className="flex items-center gap-2 text-[13px] font-medium text-emerald-700">
                            <FiCheckCircle className="text-[15px]" />
                            {detailRequest.stampedFile}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <DetailSection
                  icon={LuTestTube}
                  title="Thông tin mẫu"
                  description="Các thông tin định danh của mẫu thực phẩm được gửi kiểm nghiệm."
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <DetailField
                      label="Mã mẫu"
                      value={detailRequest.sampleId ?? "Chưa cập nhật"}
                    />
                    <DetailField
                      label="Tên mẫu"
                      value={detailRequest.sampleType}
                    />
                    <DetailField
                      label="Ngày lấy mẫu"
                      value={detailRequest.collectedDate ?? "Chưa cập nhật"}
                    />
                  </div>
                </DetailSection>

                <DetailSection
                  icon={LuClipboardList}
                  title="Chỉ tiêu kiểm nghiệm"
                  description="Danh sách các hạng mục cần được phòng lab đánh giá."
                >
                  {detailRequest.criteria && detailRequest.criteria.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {detailRequest.criteria.map((criterion) => (
                        <span
                          key={criterion}
                          className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-[13px] font-semibold text-sky-700"
                        >
                          <FiCheckCircle className="text-[14px]" />
                          {criterion}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-[13px] text-slate-500">
                      Chưa có chỉ tiêu kiểm nghiệm.
                    </div>
                  )}
                </DetailSection>

                <DetailSection
                  icon={FiFileText}
                  title="Nội dung yêu cầu"
                  description="Mô tả chi tiết về phạm vi và mục tiêu của đợt kiểm nghiệm."
                >
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-[14px] leading-7 text-slate-700">
                    {detailRequest.requestContent ?? "Không có mô tả."}
                  </div>
                </DetailSection>

                <DetailSection
                  icon={LuBuilding2}
                  title="Thông tin xử lý"
                  description="Tóm tắt đơn vị tiếp nhận, lịch xử lý và các tệp kết quả liên quan."
                >
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <DetailField label="Phòng lab" value={detailRequest.lab} />
                    <DetailField
                      label="Ngày tạo đơn"
                      value={detailRequest.requestDate}
                    />
                    <DetailField
                      label="Trạng thái"
                      value={
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold ${DETAIL_STATUS_CONFIG[detailRequest.status].className}`}
                        >
                          {DETAIL_STATUS_CONFIG[detailRequest.status].label}
                        </span>
                      }
                    />
                    <DetailField
                      label="Tệp đính kèm"
                      value={detailRequest.stampedFile ?? "Chưa có tệp"}
                    />
                  </div>
                </DetailSection>
              </div>
            ) : null}
          </TableCard>
        )}
      </div>

      {isModalOpen && selectedRequest && canManageResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b bg-slate-50 px-6 py-5">
              <h3 className="text-lg font-semibold text-slate-900">
                Nhập kết quả kiểm nghiệm
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-3xl leading-none text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-sm text-slate-500">Mã yêu cầu</p>
                <p className="mt-1 font-mono font-semibold text-slate-800">
                  {selectedRequest.id}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Trạng thái
                </label>
                <select
                  value={modalStatus}
                  onChange={(event) =>
                    setModalStatus(event.target.value as TestRequest["status"])
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang thực hiện</option>
                  <option value="completed">Hoàn thành</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Kết luận cuối cùng
                </label>
                <select
                  value={resultStatus}
                  onChange={(event) =>
                    setResultStatus(event.target.value as "Đạt" | "Không đạt")
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Đạt">Đạt tiêu chuẩn</option>
                  <option value="Không đạt">Không đạt</option>
                </select>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Tải lên tệp kết quả có dấu mộc{" "}
                  <span className="text-red-500">*</span>
                </label>
                <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 p-8 transition-colors hover:border-sky-400">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.png"
                  />
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <FiFileText className="text-[20px]" />
                  </div>
                  <p className="font-medium text-slate-700">
                    {stampedFileName || "Chọn file PDF hoặc ảnh có dấu mộc"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Định dạng: PDF, JPG, PNG
                  </p>
                </label>
              </div>

              {resultStatus === "Không đạt" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Lý do không đạt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Nhập lý do chi tiết không đạt..."
                    className="min-h-[120px] w-full resize-y rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl px-6 py-2.5 font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={saveResult}
                disabled={isSaveDisabled}
                className="rounded-xl bg-sky-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Lưu kết quả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
