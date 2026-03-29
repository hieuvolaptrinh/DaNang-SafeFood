"use client";

import { useState } from "react";
import { useRole } from "@/lib/RoleContext";
import Badge from "@/components/Badge";
import CreateInspectionRequestForm, {
  type FoodInspectionRequestRecord,
} from "@/components/CreateInspectionRequestForm";
import DataTable, { type Column } from "@/components/DataTable";
import AlertBanner from "@/components/AlertBanner";
import TableCard, {
  FilterSelect,
  Pagination,
  SearchInput,
} from "@/components/TableCard";
import ViewInspectionRequestDetail, {
  type ViewInspectionRequestData,
} from "@/components/ViewInspectionRequestDetail";

export interface TestRequest
  extends FoodInspectionRequestRecord,
    ViewInspectionRequestData {
  result?: string;
  reason?: string;
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
    facilityName: "Nhà hàng Hải Sản Biển Xanh",
    address: "12 Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng",
    type: "Nhà hàng hải sản",
    createdAt: "23/03/2025",
    inspector: "Nguyễn Văn Trần",
    samples: ["Mẫu hải sản tươi sống", "Mẫu nước đá bảo quản"],
    criteria: ["Vi sinh", "Kim loại nặng"],
    notes: "Ưu tiên trả kết quả trong ngày do mẫu cần bảo quản lạnh.",
    fileName: "yeu-cau-kiem-nghiem-yc-2025001.pdf",
    result: "Đạt tiêu chuẩn",
  },
  {
    id: "YC-2025002",
    business: "Cửa hàng Thực phẩm Sạch Organic",
    sampleType: "Mẫu rau hữu cơ",
    requestDate: "24/03/2025",
    deadline: "02/04/2025",
    status: "pending",
    lab: "Lab Việt Nam",
    facilityName: "Cửa hàng Thực phẩm Sạch Organic",
    address: "45 Lê Đình Lý, Thanh Khê, Đà Nẵng",
    type: "Cửa hàng thực phẩm sạch",
    createdAt: "24/03/2025",
    inspector: "Lê Thị Mai",
    samples: ["Mẫu rau cải hữu cơ", "Mẫu xà lách đóng gói"],
    criteria: ["Dư lượng thuốc bảo vệ thực vật", "Cảm quan"],
    notes: "Kiểm tra bổ sung chỉ tiêu cảm quan theo phản ánh của người dân.",
    fileName: "phieu-gui-mau-yc-2025002.docx",
  },
  {
    id: "YC-2025003",
    business: "Siêu thị Mini Mart Đà Nẵng",
    sampleType: "Mẫu nước đá",
    requestDate: "20/03/2025",
    deadline: "28/03/2025",
    status: "completed",
    lab: "Trung tâm Kiểm nghiệm Đà Nẵng",
    facilityName: "Siêu thị Mini Mart Đà Nẵng",
    address: "88 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
    type: "Siêu thị mini",
    createdAt: "20/03/2025",
    inspector: "Phạm Văn Đức",
    samples: ["Mẫu nước đá viên", "Mẫu nước sử dụng pha chế"],
    criteria: ["Vi sinh"],
    notes: "Mẫu lấy tại quầy đồ uống tự phục vụ.",
    fileName: "bien-ban-kem-yc-2025003.pdf",
    result: "Không đạt",
    reason: "Vi phạm giới hạn vi sinh vật",
  },
];

const STATUS_CONFIG: Record<
  TestRequest["status"],
  { label: string; badgeVariant: "pending" | "in-progress" | "resolved" }
> = {
  pending: { label: "Chờ xử lý", badgeVariant: "pending" },
  processing: { label: "Đang thực hiện", badgeVariant: "in-progress" },
  completed: { label: "Hoàn thành", badgeVariant: "resolved" },
};

function normalizeRequestForView(
  request: FoodInspectionRequestRecord,
): TestRequest {
  return {
    ...request,
    facilityName: request.business,
    address: "Chưa cập nhật địa chỉ cơ sở",
    type: "Cơ sở kinh doanh thực phẩm",
    createdAt: request.requestDate,
    inspector: "Chưa phân công",
    samples: [request.sampleType],
    criteria: [],
    notes: "Đơn được tạo mới từ biểu mẫu yêu cầu kiểm nghiệm.",
    fileName: undefined,
  };
}

function renderRequestStatus(status: TestRequest["status"]) {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.badgeVariant} label={config.label} />;
}

export default function YeuCauPage() {
  const { role } = useRole();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [requests, setRequests] = useState<TestRequest[]>(mockTestRequests);
  const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(
    null,
  );
  const [mode, setMode] = useState<"list" | "create" | "view">("list");
  const [selectedSampleId] = useState("SAMPLE-2025-001");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const canCreateRequest = role === "INSPECTOR";

  const filtered = requests.filter((request) => {
    const matchSearch =
      !search ||
      request.business.toLowerCase().includes(search.toLowerCase()) ||
      request.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || request.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    {
      label: "Tổng yêu cầu",
      value: requests.length,
      icon: "📋",
      color: "from-violet-600 to-purple-600",
    },
    {
      label: "Chờ xử lý",
      value: requests.filter((request) => request.status === "pending").length,
      icon: "⏳",
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Đang thực hiện",
      value: requests.filter((request) => request.status === "processing")
        .length,
      icon: "🔬",
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Hoàn thành",
      value: requests.filter((request) => request.status === "completed").length,
      icon: "✅",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const handleCreateClick = () => {
    setFeedbackMessage("");
    setSelectedRequest(null);
    setMode("create");
  };

  const handleCancelCreate = () => {
    setMode("list");
  };

  const handleCreateSuccess = (request: FoodInspectionRequestRecord) => {
    setRequests((current) => [normalizeRequestForView(request), ...current]);
    setMode("list");
    setFeedbackMessage("Đơn kiểm định đã được tạo và gửi thành công");
  };

  const handleViewRequest = (request: TestRequest) => {
    setSelectedRequest(request);
    setFeedbackMessage("");
    setMode("view");
  };

  const handleBackToList = () => {
    setSelectedRequest(null);
    setMode("list");
  };

  const columns: Column<TestRequest>[] = [
    {
      key: "id",
      header: "Mã yêu cầu",
      render: (request) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[12px] font-semibold text-slate-500">
          {request.id}
        </span>
      ),
    },
    {
      key: "business",
      header: "Cơ sở",
      render: (request) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-purple-200 text-sm font-black text-violet-600">
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
        <span className="text-slate-600">{request.sampleType}</span>
      ),
    },
    { key: "requestDate", header: "Ngày yêu cầu" },
    { key: "deadline", header: "Hạn hoàn thành" },
    {
      key: "status",
      header: "Trạng thái",
      render: (request) => renderRequestStatus(request.status),
    },
    {
      key: "lab",
      header: "Phòng lab",
      render: (request) => <span className="text-slate-600">{request.lab}</span>,
    },
    {
      key: "result",
      header: "Kết quả kiểm nghiệm",
      render: (request) => {
        if (!request.result) {
          return <span className="text-slate-400">—</span>;
        }

        return (
          <div className="text-[13px]">
            <div
              className={
                request.result.includes("Không đạt")
                  ? "font-medium text-red-600"
                  : "font-medium text-emerald-600"
              }
            >
              {request.result}
            </div>
            {request.reason && (
              <div className="mt-0.5 line-clamp-1 text-[12px] text-red-500">
                {request.reason}
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
        <div className="flex gap-2 transition-opacity">
          <button
            type="button"
            onClick={() => handleViewRequest(request)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-base transition-all hover:border-violet-300 hover:bg-violet-50"
            title="Xem chi tiết"
          >
            👁
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400" />

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-violet-500">
                SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
              </span>
            </div>
            <h1 className="text-[28px] font-black leading-tight tracking-tight text-slate-900">
              Yêu cầu Kiểm nghiệm
            </h1>
            <p className="mt-1 text-[13px] font-medium text-slate-400">
              Quản lý các yêu cầu kiểm nghiệm mẫu từ cơ sở kinh doanh
            </p>
          </div>

          {mode === "list" && (
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                📥 Xuất danh sách
              </button>
              {canCreateRequest && (
                <button
                  type="button"
                  onClick={handleCreateClick}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-violet-700"
                >
                  + Tạo yêu cầu mới
                </button>
              )}
            </div>
          )}
        </div>

        {mode === "create" ? (
          <div className="request-view-transition">
            <CreateInspectionRequestForm
              selectedSampleId={selectedSampleId}
              onCancel={handleCancelCreate}
              onSuccess={handleCreateSuccess}
            />
          </div>
        ) : mode === "view" && selectedRequest ? (
          <div className="request-view-transition">
            <ViewInspectionRequestDetail
              data={selectedRequest}
              onBack={handleBackToList}
            />
          </div>
        ) : (
          <div className="request-view-transition">
            {feedbackMessage && (
              <div className="mb-6">
                <AlertBanner type="success" title={feedbackMessage} />
              </div>
            )}

            <div className="mb-8 grid grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
                        {stat.label}
                      </p>
                      <p className="text-[30px] font-black leading-none text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-sm ${stat.color}`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                  info={`Hiển thị ${filtered.length} trong tổng số ${requests.length} yêu cầu`}
                />
              }
            >
              <DataTable
                columns={columns}
                data={filtered}
                emptyMessage="Không tìm thấy yêu cầu kiểm nghiệm nào"
              />
            </TableCard>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes requestViewFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .request-view-transition {
          animation: requestViewFade 0.22s ease-out;
        }
      `}</style>
    </div>
  );
}
