"use client";

import { useState } from "react";
import { FiEye } from "react-icons/fi";
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
  stampedFile?: string;           // Thêm field mới
  technicalParams?: string;       // Thêm field mới (thông số kỹ thuật)
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [data, setData] = useState(mockTestRequests);

  // Modal state - Đã thay đổi theo yêu cầu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null);
  const [resultStatus, setResultStatus] = useState<'Đạt' | 'Không đạt'>('Đạt');
  const [reason, setReason] = useState('');
  const [stampedFileName, setStampedFileName] = useState('');   // Tên file có dấu mộc

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

  const openResultModal = (request: TestRequest) => {
    setSelectedRequest(request);
    setResultStatus(request.result?.includes('Không đạt') ? 'Không đạt' : 'Đạt');
    setReason(request.reason || '');
    setStampedFileName('');
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStampedFileName(file.name);
    }
  };

  const saveResult = () => {
    if (!selectedRequest) return;

  const handleCreateSuccess = (request: FoodInspectionRequestRecord) => {
    setRequests((current) => [normalizeRequestForView(request), ...current]);
    setMode("list");
    setFeedbackMessage("Đơn kiểm định đã được tạo và gửi thành công");
  };

    setData(prev => prev.map(item =>
      item.id === selectedRequest.id 
        ? { 
            ...item, 
            result: finalResult, 
            reason: resultStatus === 'Không đạt' ? reason.trim() : undefined,
            stampedFile: stampedFileName || undefined,
          } 
        : item
    ));

    console.log('Kết quả kiểm nghiệm đã được lưu:', {
      id: selectedRequest.id,
      business: selectedRequest.business,
      result: finalResult,
      reason: resultStatus === 'Không đạt' ? reason.trim() : undefined,
      stampedFile: stampedFileName,
    });

    setIsModalOpen(false);
    setSelectedRequest(null);
    setReason('');
    setStampedFileName('');
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
            {r.stampedFile && (
              <div className="text-[11px] text-emerald-600 mt-1">✓ Có file có dấu mộc</div>
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
            <FiEye size={16} className="mx-auto" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400" />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header, Stats, TableCard giữ nguyên như cũ */}
        <div className="flex items-start justify-between mb-8">
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

          <div className="flex gap-3 pt-1">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              📥 Xuất danh sách
            </button>
            {canCreateRequest && (
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold transition-all shadow-sm">
                + Tạo yêu cầu mới
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards giữ nguyên */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tổng yêu cầu', value: '248', icon: '📋', color: 'from-violet-600 to-purple-600' },
            { label: 'Chờ xử lý', value: '67', icon: '⏳', color: 'from-amber-500 to-orange-500' },
            { label: 'Đang thực hiện', value: '94', icon: '🔬', color: 'from-blue-500 to-cyan-600' },
            { label: 'Hoàn thành', value: '187', icon: '✅', color: 'from-emerald-500 to-teal-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{s.label}</p>
                  <p className="text-[30px] font-black text-slate-900 leading-none">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-sm`}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <TableCard
          title="Danh sách yêu cầu kiểm nghiệm"
          controls={
            <>
              <SearchInput placeholder="Tìm mã yêu cầu, tên cơ sở..." onChange={setSearch} />
              <FilterSelect
                options={[
                  { value: '', label: 'Tất cả trạng thái' },
                  { value: 'pending', label: 'Chờ xử lý' },
                  { value: 'processing', label: 'Đang thực hiện' },
                  { value: 'completed', label: 'Hoàn thành' },
                ]}
                onChange={setStatusFilter}
              />
            </>
          }
          footer={<Pagination info={`Hiển thị ${filtered.length} trong tổng số ${mockTestRequests.length} yêu cầu`} />}
        >
          <DataTable 
            columns={columns} 
            data={filtered as unknown as Record<string, unknown>[]} 
            emptyMessage="Không tìm thấy yêu cầu kiểm nghiệm nào"
            rowClassName="hover:bg-violet-50/30 group transition-colors"
          />
        </TableCard>
      </div>

      {/* ==================== MODAL ĐÃ CHỈNH SỬA ==================== */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900">Nhập kết quả kiểm nghiệm</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-3xl text-slate-400 hover:text-slate-600 leading-none"
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kết luận cuối cùng</label>
                <select
                  value={resultStatus}
                  onChange={(e) => setResultStatus(e.target.value as 'Đạt' | 'Không đạt')}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="Đạt">Đạt tiêu chuẩn</option>
                  <option value="Không đạt">Không đạt</option>
                </select>
              </div>

              {/* Phần mới: Tải lên tệp kết quả có dấu mộc */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Tải lên tệp kết quả có dấu mộc <span className="text-red-500">*</span>
                </label>
                <label className="border-2 border-dashed border-slate-300 hover:border-violet-400 rounded-2xl p-8 flex flex-col items-center cursor-pointer transition-colors">
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf,.jpg,.png" 
                  />
                  <div className="text-4xl mb-3">📎</div>
                  <p className="font-medium text-slate-700">
                    {stampedFileName || "Chọn file PDF hoặc ảnh có dấu mộc"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Định dạng: PDF, JPG, PNG</p>
                </label>
              </div>

              {resultStatus === 'Không đạt' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lý do không đạt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do chi tiết không đạt..."
                    className="w-full h-32 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y min-h-[120px]"
                  />
                </div>
              ))}
            </div>

            <div className="px-6 py-5 border-t bg-slate-50 flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={saveResult}
                disabled={resultStatus === 'Không đạt' && !reason.trim() || !stampedFileName}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors"
              >
                Lưu kết quả
              </button>
            </div>
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
