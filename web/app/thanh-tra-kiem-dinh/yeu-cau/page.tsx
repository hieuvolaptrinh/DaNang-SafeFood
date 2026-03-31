"use client";

import { useState } from "react";
import { FiEye, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { LuTestTube, LuClipboardList, LuFileText, LuBuilding2, LuSearch } from "react-icons/lu";
import { useRole } from "@/lib/RoleContext";
import Badge from "@/components/Badge";
import DataTable, { type Column } from "@/components/DataTable";
import TableCard, {
  FilterSelect,
  Pagination,
  SearchInput,
} from "@/components/TableCard";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

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
  // Detail fields
  sampleId?: string;
  collectedDate?: string;
  criteria?: string[];
  requestContent?: string;
}

interface MockSample {
  id: string;
  name: string;
  collectedDate: string;
}

// ────────────────────────────────────────────────
// Mock Data
// ────────────────────────────────────────────────

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
    requestContent: "Kiểm nghiệm mẫu hải sản tươi sống, đảm bảo không nhiễm vi khuẩn E.coli và Salmonella theo QCVN 8-3:2012/BYT.",
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
    requestContent: "Kiểm tra dư lượng thuốc bảo vệ thực vật và kim loại nặng trong rau hữu cơ theo tiêu chuẩn hữu cơ Việt Nam.",
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
    requestContent: "Kiểm tra chỉ tiêu vi sinh và cảm quan của mẫu nước đá dùng cho thực phẩm tại siêu thị.",
  },
];

// Mock collected samples (simulating "Gửi mẫu" was done)
const mockSamples: MockSample[] = [
  { id: "M-2025-001", name: "Mẫu hải sản tươi sống", collectedDate: "26/03/2025" },
  { id: "M-2025-002", name: "Mẫu rau củ hữu cơ", collectedDate: "27/03/2025" },
  { id: "M-2025-003", name: "Mẫu nước uống đóng chai", collectedDate: "28/03/2025" },
];

const MOCK_AGENCIES = [
  "Trung tâm Kiểm nghiệm Đà Nẵng",
  "Lab Việt Nam",
  "Viện Kiểm nghiệm VSATTP Quốc gia",
  "Trung tâm Y tế Dự phòng TP. Đà Nẵng",
];

const CRITERIA_OPTIONS = [
  { key: "viSinh", label: "Vi sinh" },
  { key: "hoaHoc", label: "Hóa học" },
  { key: "kimLoaiNang", label: "Kim loại nặng" },
  { key: "camQuan", label: "Cảm quan" },
  { key: "khac", label: "Khác" },
];

const STATUS_CONFIG: Record<TestRequest["status"], { label: string; variant: string }> = {
  pending: { label: "Chờ xử lý", variant: "pending" },
  processing: { label: "Đang thực hiện", variant: "in-progress" },
  completed: { label: "Hoàn thành", variant: "resolved" },
};

// ────────────────────────────────────────────────
// Main Page Component
// ────────────────────────────────────────────────

type ViewMode = "list" | "create";
type SubmitState = "idle" | "loading" | "success";

export default function YeuCauPage() {
  const { role } = useRole();

  // ── List view state ──
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState<TestRequest[]>(mockTestRequests);

  // ── View toggle ──
  const [view, setView] = useState<ViewMode>("list");

  // ── Result modal state (for TESTER) ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null);
  const [resultStatus, setResultStatus] = useState<"Đạt" | "Không đạt">("Đạt");
  const [reason, setReason] = useState("");
  const [stampedFileName, setStampedFileName] = useState("");

  // ── Detail modal state ──
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState<TestRequest | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailNotFound, setDetailNotFound] = useState(false);

  // ── Create form state ──
  const [selectedSampleId, setSelectedSampleId] = useState(mockSamples[0]?.id ?? "");
  const [criteria, setCriteria] = useState<Record<string, boolean>>({
    viSinh: false, hoaHoc: false, kimLoaiNang: false, camQuan: false, khac: false,
  });
  const [khacText, setKhacText] = useState("");
  const [requestContent, setRequestContent] = useState("");
  const [agency, setAgency] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [formError, setFormError] = useState("");

  const canCreateRequest = role === "INSPECTOR";
  const canManageResult = role === "TESTER";

  // ── Derived ──
  const selectedSample = mockSamples.find((s) => s.id === selectedSampleId) ?? null;
  const sampleNotFound = mockSamples.length === 0;
  const anyCriteriaChecked = Object.values(criteria).some(Boolean);

  const filtered = data.filter((r) => {
    const matchSearch =
      !search ||
      r.business.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ────────────────────────────────────────────────
  // Handlers – Detail Modal
  // ────────────────────────────────────────────────

  const openDetail = async (req: TestRequest) => {
    setDetailRequest(null);
    setDetailNotFound(false);
    setDetailLoading(true);
    setIsDetailOpen(true);
    // Simulate async fetch (mock 800ms)
    await new Promise((r) => setTimeout(r, 800));
    const found = data.find((d) => d.id === req.id) ?? null;
    if (!found) {
      setDetailNotFound(true);
    } else {
      setDetailRequest(found);
    }
    setDetailLoading(false);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setDetailRequest(null);
    setDetailNotFound(false);
  };

  // ────────────────────────────────────────────────
  // Handlers – Result Modal
  // ────────────────────────────────────────────────

  const openResultModal = (request: TestRequest) => {
    setSelectedRequest(request);
    setResultStatus(request.result?.includes("Không đạt") ? "Không đạt" : "Đạt");
    setReason(request.reason || "");
    setStampedFileName("");
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setStampedFileName(file.name);
  };

  const saveResult = () => {
    if (!selectedRequest) return;
    const finalResult = resultStatus === "Đạt" ? "Đạt tiêu chuẩn" : "Không đạt";
    setData((prev) =>
      prev.map((item) =>
        item.id === selectedRequest.id
          ? { ...item, result: finalResult, reason: resultStatus === "Không đạt" ? reason.trim() : undefined, stampedFile: stampedFileName || undefined }
          : item
      )
    );
    setIsModalOpen(false);
    setSelectedRequest(null);
    setReason("");
    setStampedFileName("");
  };

  // ────────────────────────────────────────────────
  // Handlers – Create Form
  // ────────────────────────────────────────────────

  const openCreateForm = () => {
    // Reset form
    setSelectedSampleId(mockSamples[0]?.id ?? "");
    setCriteria({ viSinh: false, hoaHoc: false, kimLoaiNang: false, camQuan: false, khac: false });
    setKhacText("");
    setRequestContent("");
    setAgency("");
    setSubmitState("idle");
    setFormError("");
    setView("create");
  };

  const handleCriteriaChange = (key: string) => {
    setCriteria((prev) => ({ ...prev, [key]: !prev[key] }));
    setFormError("");
  };

  const handleSubmitCreate = async () => {
    setFormError("");

    // E2: no samples
    if (sampleNotFound) {
      setFormError("Không tìm thấy mã mẫu vật, vui lòng thực hiện chức năng Gửi mẫu trước");
      return;
    }

    // E1: no criteria
    if (!anyCriteriaChecked) {
      setFormError("Vui lòng chọn ít nhất một chỉ tiêu để kiểm định");
      return;
    }

    if (!agency) {
      setFormError("Vui lòng chọn cơ quan kiểm định");
      return;
    }

    setSubmitState("loading");

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Build new request
    const newId = `YC-${Date.now().toString().slice(-7)}`;
    const today = new Date();
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    const deadlineDate = new Date(today);
    deadlineDate.setDate(deadlineDate.getDate() + 7);

    const newRequest: TestRequest = {
      id: newId,
      business: selectedSample?.name ?? "Mẫu không xác định",
      sampleType: selectedSample?.name ?? "",
      requestDate: fmt(today),
      deadline: fmt(deadlineDate),
      status: "pending",
      lab: agency,
    };

    setData((prev) => [newRequest, ...prev]);
    setSubmitState("success");

    // Auto-return to list after 2s
    setTimeout(() => {
      setView("list");
      setSubmitState("idle");
    }, 2000);
  };

  // ────────────────────────────────────────────────
  // Columns
  // ────────────────────────────────────────────────

  const columns: Column<TestRequest>[] = [
    {
      key: "id",
      header: "Mã yêu cầu",
      render: (r) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[12px] font-semibold text-slate-500">
          {r.id}
        </span>
      ),
    },
    {
      key: "business",
      header: "Cơ sở",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-purple-200 text-sm font-black text-violet-600">
            {r.business.charAt(0)}
          </div>
          <span className="text-[13px] font-semibold text-slate-800">{r.business}</span>
        </div>
      ),
    },
    {
      key: "sampleType",
      header: "Loại mẫu",
      render: (r) => <span className="text-slate-600">{r.sampleType}</span>,
    },
    { key: "requestDate", header: "Ngày yêu cầu" },
    { key: "deadline", header: "Hạn hoàn thành" },
    {
      key: "status",
      header: "Trạng thái",
      render: (r) => {
        const config = STATUS_CONFIG[r.status];
        return <Badge variant={config.variant} label={config.label} />;
      },
    },
    {
      key: "lab",
      header: "Phòng lab",
      render: (r) => <span className="text-slate-600">{r.lab}</span>,
    },
    {
      key: "result",
      header: "Kết quả kiểm nghiệm",
      render: (r) => {
        if (!r.result) return <span className="text-amber-600 italic text-[13px]">Chưa có kết quả</span>;
        return (
          <div className="text-[13px]">
            <div className={r.result.includes("Không đạt") ? "text-red-600 font-medium" : "text-emerald-600 font-medium"}>
              {r.result}
            </div>
            {r.reason && <div className="mt-0.5 line-clamp-1 text-[12px] text-red-500">{r.reason}</div>}
            {r.stampedFile && <div className="text-[11px] text-emerald-600 mt-1">✓ Có file có dấu mộc</div>}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (r) => (
        <div className="flex gap-2">
          {canManageResult && (
            <button
              onClick={() => openResultModal(r)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-400 text-base transition-all"
              title="Nhập kết quả kiểm nghiệm"
            >
              📝
            </button>
          )}
          <button
            onClick={() => openDetail(r)}
            disabled={detailLoading}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-violet-50 hover:border-violet-300 text-base transition-all disabled:opacity-50"
            title="Xem chi tiết"
          >
            <FiEye size={16} />
          </button>
        </div>
      ),
    },
  ];

  // ────────────────────────────────────────────────
  // Shared page shell (header always visible)
  // ────────────────────────────────────────────────

  const isFormDisabled = sampleNotFound || submitState === "loading" || submitState === "success";
  const canSubmit = !isFormDisabled && anyCriteriaChecked && !!agency;

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400" />

      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            {view === "create" && (
              <button
                onClick={() => setView("list")}
                className="mb-3 flex items-center gap-1.5 text-[13px] font-medium text-violet-600 hover:text-violet-800 transition-colors"
              >
                <FiArrowLeft size={14} />
                Quay lại danh sách
              </button>
            )}
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-violet-500">
                SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
              </span>
            </div>
            <h1 className="text-[28px] font-black leading-tight tracking-tight text-slate-900">
              {view === "list" ? "Yêu cầu Kiểm nghiệm" : "Tạo yêu cầu Kiểm nghiệm"}
            </h1>
            <p className="mt-1 text-[13px] font-medium text-slate-400">
              {view === "list"
                ? "Quản lý các yêu cầu kiểm nghiệm mẫu từ cơ sở kinh doanh"
                : "Điền đầy đủ thông tin để tạo đơn kiểm định thực phẩm"}
            </p>
          </div>

          {view === "list" && (
            <div className="flex gap-3 pt-1">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                📥 Xuất danh sách
              </button>
              {canCreateRequest && (
                <button
                  id="btn-tao-yeu-cau-moi"
                  onClick={openCreateForm}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold transition-all shadow-sm"
                >
                  + Tạo yêu cầu mới
                </button>
              )}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            LIST VIEW
        ══════════════════════════════════════════ */}
        {view === "list" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: "Tổng yêu cầu", value: data.length, icon: "📋", color: "from-violet-600 to-purple-600" },
                { label: "Chờ xử lý", value: data.filter((r) => r.status === "pending").length, icon: "⏳", color: "from-amber-500 to-orange-500" },
                { label: "Đang thực hiện", value: data.filter((r) => r.status === "processing").length, icon: "🔬", color: "from-blue-500 to-cyan-600" },
                { label: "Hoàn thành", value: data.filter((r) => r.status === "completed").length, icon: "✅", color: "from-emerald-500 to-teal-500" },
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
                      { value: "", label: "Tất cả trạng thái" },
                      { value: "pending", label: "Chờ xử lý" },
                      { value: "processing", label: "Đang thực hiện" },
                      { value: "completed", label: "Hoàn thành" },
                    ]}
                    onChange={setStatusFilter}
                  />
                </>
              }
              footer={<Pagination info={`Hiển thị ${filtered.length} trong tổng số ${data.length} yêu cầu`} />}
            >
              <DataTable
                columns={columns}
                data={filtered}
                emptyMessage="Không tìm thấy yêu cầu kiểm nghiệm nào"
                className="hover:bg-violet-50/30 group transition-colors"
              />
            </TableCard>
          </>
        )}

        {/* ══════════════════════════════════════════
            CREATE FORM VIEW
        ══════════════════════════════════════════ */}
        {view === "create" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Form title bar */}
            <div className="px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50">
              <h2 className="text-[16px] font-bold text-slate-800">Tạo yêu cầu kiểm định thực phẩm</h2>
            </div>

            {/* Success banner */}
            {submitState === "success" && (
              <div className="mx-8 mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4">
                <FiCheckCircle className="text-emerald-500 text-xl flex-shrink-0" />
                <p className="text-[14px] font-semibold text-emerald-700">
                  Đơn kiểm định đã được tạo và gửi thành công. Đang chuyển về danh sách...
                </p>
              </div>
            )}

            {/* E2: Sample not found banner */}
            {sampleNotFound && (
              <div className="mx-8 mt-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-5 py-4">
                <FiAlertCircle className="text-red-500 text-xl flex-shrink-0" />
                <p className="text-[14px] font-semibold text-red-700">
                  Không tìm thấy mã mẫu vật, vui lòng thực hiện chức năng Gửi mẫu trước
                </p>
              </div>
            )}

            <div className="px-8 py-8 space-y-10">

              {/* ── Section 1: Thông tin mẫu ── */}
              <section>
                <div className="mb-4">
                  <h3 className="text-[15px] font-bold text-slate-800">1. Thông tin mẫu</h3>
                  <p className="text-[12px] text-violet-500 mt-0.5">Thông tin mẫu được tự động lấy từ mẫu đã thu thập.</p>
                </div>

                {/* Sample picker */}
                {!sampleNotFound && (
                  <div className="mb-4">
                    <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Chọn mẫu</label>
                    <select
                      id="select-mau"
                      value={selectedSampleId}
                      onChange={(e) => setSelectedSampleId(e.target.value)}
                      className="w-full max-w-xs border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                    >
                      {mockSamples.map((s) => (
                        <option key={s.id} value={s.id}>{s.id} – {s.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Mã mẫu", value: selectedSample?.id ?? "—" },
                    { label: "Tên mẫu", value: selectedSample?.name ?? "—" },
                    { label: "Ngày lấy mẫu", value: selectedSample?.collectedDate ?? "—" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="block text-[12px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{label}</label>
                      <input
                        readOnly
                        value={value}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] bg-slate-50 text-slate-700 font-medium cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Section 2: Chỉ tiêu kiểm định ── */}
              <section>
                <div className="mb-4">
                  <h3 className="text-[15px] font-bold text-slate-800">2. Chỉ tiêu kiểm định</h3>
                  <p className="text-[12px] text-violet-500 mt-0.5">Chọn ít nhất một chỉ tiêu kiểm định cho mẫu.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {CRITERIA_OPTIONS.filter((c) => c.key !== "khac").map((opt) => (
                    <label
                      key={opt.key}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                        criteria[opt.key]
                          ? "border-violet-400 bg-violet-50"
                          : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40"
                      }`}
                    >
                      <input
                        id={`criteria-${opt.key}`}
                        type="checkbox"
                        checked={criteria[opt.key]}
                        onChange={() => handleCriteriaChange(opt.key)}
                        disabled={isFormDisabled}
                        className="w-4 h-4 accent-violet-600"
                      />
                      <span className="text-[14px] font-medium text-slate-700">{opt.label}</span>
                    </label>
                  ))}
                </div>

                {/* Khác row */}
                <div className={`mt-3 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  criteria.khac ? "border-violet-400 bg-violet-50" : "border-slate-200 bg-white"
                }`}>
                  <input
                    id="criteria-khac"
                    type="checkbox"
                    checked={criteria.khac}
                    onChange={() => handleCriteriaChange("khac")}
                    disabled={isFormDisabled}
                    className="w-4 h-4 accent-violet-600 flex-shrink-0"
                  />
                  <span className="text-[14px] font-medium text-slate-700 flex-shrink-0">Khác</span>
                  {criteria.khac && (
                    <input
                      id="criteria-khac-text"
                      type="text"
                      value={khacText}
                      onChange={(e) => setKhacText(e.target.value)}
                      placeholder="Mô tả chỉ tiêu khác..."
                      disabled={isFormDisabled}
                      className="flex-1 border-b border-violet-300 bg-transparent px-2 py-0.5 text-[13px] focus:outline-none text-slate-700"
                    />
                  )}
                </div>
              </section>

              {/* ── Section 3: Nội dung yêu cầu ── */}
              <section>
                <div className="mb-4">
                  <h3 className="text-[15px] font-bold text-slate-800">3. Nội dung yêu cầu</h3>
                  <p className="text-[12px] text-violet-500 mt-0.5">Mô tả rõ nội dung và mục tiêu kiểm định.</p>
                </div>
                <label className="block text-[13px] font-semibold text-slate-600 mb-2">Yêu cầu kiểm định</label>
                <textarea
                  id="textarea-yeu-cau"
                  value={requestContent}
                  onChange={(e) => setRequestContent(e.target.value)}
                  placeholder="Nhập yêu cầu kiểm định chi tiết..."
                  disabled={isFormDisabled}
                  rows={5}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-400 resize-y min-h-[120px] text-slate-700 disabled:bg-slate-50"
                />
              </section>

              {/* ── Section 4: Gửi đến ── */}
              <section>
                <div className="mb-4">
                  <h3 className="text-[15px] font-bold text-slate-800">4. Gửi đến</h3>
                  <p className="text-[12px] text-violet-500 mt-0.5">Chọn cơ quan thực hiện kiểm định mẫu thực phẩm.</p>
                </div>
                <label className="block text-[13px] font-semibold text-slate-600 mb-2">Cơ quan kiểm định</label>
                <select
                  id="select-co-quan"
                  value={agency}
                  onChange={(e) => { setAgency(e.target.value); setFormError(""); }}
                  disabled={isFormDisabled}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white text-slate-700 disabled:bg-slate-50"
                >
                  <option value="">Chọn cơ quan kiểm định</option>
                  {MOCK_AGENCIES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </section>

              {/* ── Error message ── */}
              {formError && (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-5 py-4">
                  <FiAlertCircle className="text-red-500 text-lg flex-shrink-0" />
                  <p className="text-[13px] font-semibold text-red-700">{formError}</p>
                </div>
              )}
            </div>

            {/* ── Footer Buttons ── */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                id="btn-huy"
                onClick={() => setView("list")}
                disabled={submitState === "loading"}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                id="btn-tao-don"
                onClick={handleSubmitCreate}
                disabled={!canSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all"
              >
                {submitState === "loading" ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  "Tạo đơn"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Nhập Kết Quả (TESTER) ── */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900">Nhập kết quả kiểm nghiệm</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-3xl text-slate-400 hover:text-slate-600 leading-none">×</button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm text-slate-500">Mã yêu cầu</p>
                <p className="font-mono font-semibold text-slate-800 mt-1">{selectedRequest.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kết luận cuối cùng</label>
                <select
                  value={resultStatus}
                  onChange={(e) => setResultStatus(e.target.value as "Đạt" | "Không đạt")}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="Đạt">Đạt tiêu chuẩn</option>
                  <option value="Không đạt">Không đạt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Tải lên tệp kết quả có dấu mộc <span className="text-red-500">*</span>
                </label>
                <label className="border-2 border-dashed border-slate-300 hover:border-violet-400 rounded-2xl p-8 flex flex-col items-center cursor-pointer transition-colors">
                  <input type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.png" />
                  <div className="text-4xl mb-3">📎</div>
                  <p className="font-medium text-slate-700">{stampedFileName || "Chọn file PDF hoặc ảnh có dấu mộc"}</p>
                  <p className="text-xs text-slate-400 mt-1">Định dạng: PDF, JPG, PNG</p>
                </label>
              </div>

              {resultStatus === "Không đạt" && (
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
              )}
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
                disabled={(resultStatus === "Không đạt" && !reason.trim()) || !stampedFileName}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors"
              >
                Lưu kết quả
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {isDetailOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeDetail(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b flex items-center justify-between bg-gradient-to-r from-violet-50 to-purple-50 flex-shrink-0">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900">Chi tiết yêu cầu kiểm định</h3>
                {detailRequest && (
                  <p className="text-[12px] text-violet-500 mt-0.5 font-mono">{detailRequest.id}</p>
                )}
              </div>
              <button
                onClick={closeDetail}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1">
              {/* Loading */}
              {detailLoading && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <svg className="animate-spin h-10 w-10 text-violet-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <p className="text-[13px] text-slate-400 font-medium">Đang tải thông tin...</p>
                </div>
              )}

              {/* E1: Not found */}
              {!detailLoading && detailNotFound && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-100">
                    <LuSearch className="text-slate-400" size={40} />
                  </div>
                  <p className="text-[15px] font-semibold text-slate-700">Không tìm thấy yêu cầu kiểm định</p>
                  <p className="text-[13px] text-slate-400">Yêu cầu này có thể đã bị xóa hoặc không tồn tại</p>
                </div>
              )}

              {/* Detail content */}
              {!detailLoading && detailRequest && (() => {
                const d = detailRequest;
                const statusDetail: Record<TestRequest["status"], { label: string; color: string }> = {
                  pending:    { label: "Đã gửi",       color: "bg-blue-100 text-blue-700 border-blue-200" },
                  processing: { label: "Đang xử lý",   color: "bg-amber-100 text-amber-700 border-amber-200" },
                  completed:  { label: "Hoàn thành",   color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
                };
                const sd = statusDetail[d.status];
                return (
                  <div className="p-6 space-y-6">

                    {/* Section 1: Thông tin mẫu */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-lg bg-violet-100 flex items-center justify-center">
                          <LuTestTube className="text-violet-600" size={15} />
                        </div>
                        <h4 className="text-[14px] font-bold text-slate-800">1. Thông tin mẫu</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Mã mẫu", value: d.sampleId ?? "—" },
                          { label: "Tên mẫu", value: d.sampleType },
                          { label: "Ngày lấy mẫu", value: d.collectedDate ?? "—" },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                            <p className="text-[13px] font-semibold text-slate-800">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 2: Chỉ tiêu kiểm định */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-lg bg-violet-100 flex items-center justify-center">
                          <LuClipboardList className="text-violet-600" size={15} />
                        </div>
                        <h4 className="text-[14px] font-bold text-slate-800">2. Chỉ tiêu kiểm định</h4>
                      </div>
                      {d.criteria && d.criteria.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {d.criteria.map((c) => (
                            <span
                              key={c}
                              className="px-3 py-1.5 rounded-full text-[12px] font-semibold bg-violet-100 text-violet-700 border border-violet-200"
                            >
                              ✓ {c}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[13px] text-slate-400 italic">Chưa có chỉ tiêu</p>
                      )}
                    </div>

                    {/* Section 3: Nội dung yêu cầu */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-lg bg-violet-100 flex items-center justify-center">
                          <LuFileText className="text-violet-600" size={15} />
                        </div>
                        <h4 className="text-[14px] font-bold text-slate-800">3. Nội dung yêu cầu</h4>
                      </div>
                      <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 text-[13px] text-slate-700 leading-relaxed min-h-[70px]">
                        {d.requestContent || <span className="italic text-slate-400">Không có mô tả</span>}
                      </div>
                    </div>

                    {/* Section 4: Thông tin gửi */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-lg bg-violet-100 flex items-center justify-center">
                          <LuBuilding2 className="text-violet-600" size={15} />
                        </div>
                        <h4 className="text-[14px] font-bold text-slate-800">4. Thông tin gửi</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 col-span-2">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Cơ quan kiểm định</p>
                          <p className="text-[13px] font-semibold text-slate-800">{d.lab}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Ngày tạo đơn</p>
                          <p className="text-[13px] font-semibold text-slate-800">{d.requestDate}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Trạng thái</p>
                          <span className={`inline-block mt-0.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border ${sd.color}`}>
                            {sd.label}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Hạn hoàn thành</p>
                          <p className="text-[13px] font-semibold text-slate-800">{d.deadline}</p>
                        </div>
                        {d.result && (
                          <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Kết quả</p>
                            <p className={`text-[13px] font-semibold ${
                              d.result.includes("Không đạt") ? "text-red-600" : "text-emerald-600"
                            }`}>{d.result}</p>
                          </div>
                        )}
                      </div>
                      {d.reason && (
                        <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                          <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={14} />
                          <p className="text-[13px] text-red-700 font-medium">{d.reason}</p>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-slate-50 flex justify-end flex-shrink-0">
              <button
                onClick={closeDetail}
                id="btn-dong-chi-tiet"
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}