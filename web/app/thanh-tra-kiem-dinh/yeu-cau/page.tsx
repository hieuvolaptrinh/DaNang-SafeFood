'use client';

import { useState } from 'react';
import { useRole } from '@/lib/RoleContext';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

interface TestRequest {
  id: string;
  business: string;
  sampleType: string;
  requestDate: string;
  deadline: string;
  status: 'pending' | 'processing' | 'completed';
  lab: string;
  result?: string;
  reason?: string;
  stampedFile?: string;           // Thêm field mới
  technicalParams?: string;       // Thêm field mới (thông số kỹ thuật)
}

const mockTestRequests: TestRequest[] = [
  {
    id: 'YC-2025001',
    business: 'Nhà hàng Hải Sản Biển Xanh',
    sampleType: 'Mẫu thực phẩm tươi',
    requestDate: '23/03/2025',
    deadline: '30/03/2025',
    status: 'processing',
    lab: 'Trung tâm Kiểm nghiệm Đà Nẵng',
    result: 'Đạt tiêu chuẩn',
  },
  {
    id: 'YC-2025002',
    business: 'Cửa hàng Thực phẩm Sạch Organic',
    sampleType: 'Mẫu rau hữu cơ',
    requestDate: '24/03/2025',
    deadline: '02/04/2025',
    status: 'pending',
    lab: 'Lab Việt Nam',
  },
  {
    id: 'YC-2025003',
    business: 'Siêu thị Mini Mart Đà Nẵng',
    sampleType: 'Mẫu nước đá',
    requestDate: '20/03/2025',
    deadline: '28/03/2025',
    status: 'completed',
    lab: 'Trung tâm Kiểm nghiệm Đà Nẵng',
    result: 'Không đạt',
    reason: 'Vi phạm giới hạn vi sinh vật',
  },
];

const STATUS_CONFIG: Record<TestRequest['status'], { label: string; variant: string }> = {
  pending:    { label: 'Chờ xử lý',     variant: 'pending' },
  processing: { label: 'Đang thực hiện', variant: 'processing' },
  completed:  { label: 'Hoàn thành',     variant: 'completed' },
};

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

  const canCreateRequest = role === 'INSPECTOR';
  const canChangeStatus = role === 'TESTER';
  const canManageResult = role === 'TESTER';

  const filtered = data.filter((r) => {
    const matchSearch = !search || 
      r.business.toLowerCase().includes(search.toLowerCase()) || 
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (id: string, newStatus: TestRequest['status']) => {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

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

    const finalResult = resultStatus === 'Đạt' ? 'Đạt tiêu chuẩn' : 'Không đạt';

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
      key: 'id',
      header: 'Mã yêu cầu',
      render: (r) => (
        <span className="font-mono text-[12px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
          {r.id}
        </span>
      ),
    },
    {
      key: 'business',
      header: 'Cơ sở',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-sm font-black text-violet-600 flex-shrink-0">
            {r.business.charAt(0)}
          </div>
          <span className="font-semibold text-[13px] text-slate-800">{r.business}</span>
        </div>
      ),
    },
    {
      key: 'sampleType',
      header: 'Loại mẫu',
      render: (r) => <span className="text-slate-600">{r.sampleType}</span>,
    },
    { key: 'requestDate', header: 'Ngày yêu cầu' },
    { key: 'deadline', header: 'Hạn hoàn thành' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => {
        const config = STATUS_CONFIG[r.status];
        return !canChangeStatus ? (
          <Badge variant={config.variant}>{config.label}</Badge>
        ) : (
          <select
            value={r.status}
            onChange={(e) => handleStatusChange(r.id, e.target.value as TestRequest['status'])}
            className="bg-white border border-slate-200 text-[13px] px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
          >
            {Object.entries(STATUS_CONFIG).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        );
      },
    },
    { 
      key: 'lab', 
      header: 'Phòng lab',
      render: (r) => <span className="text-slate-600">{r.lab}</span>
    },
    {
      key: 'result',
      header: 'Kết quả kiểm nghiệm',
      render: (r) => {
        if (!r.result) {
          return canManageResult ? (
            <span className="text-amber-600 italic text-[13px]">Chưa có kết quả</span>
          ) : (
            <span className="text-slate-400">—</span>
          );
        }

        return (
          <div className="text-[13px]">
            <div className={r.result.includes('Không đạt') ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium'}>
              {r.result}
            </div>
            {r.reason && (
              <div className="text-red-500 text-[12px] mt-0.5 line-clamp-1">
                {r.reason}
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
      key: 'actions',
      header: 'Thao tác',
      render: (r) => (
        <div className="flex gap-2 transition-opacity">
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-violet-50 hover:border-violet-300 text-base transition-all"
            title="Xem chi tiết"
          >
            👁
          </button>

          {canChangeStatus && (
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-base transition-all"
              title="Cập nhật trạng thái"
            >
              ✏️
            </button>
          )}

          {canManageResult && (
            <button 
              onClick={() => openResultModal(r)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-400 text-base transition-all font-medium"
              title="Nhập / Cập nhật kết quả kiểm nghiệm"
            >
              📝
            </button>
          )}
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
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-violet-500">
                SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
              </span>
            </div>
            <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">
              Yêu cầu Kiểm nghiệm
            </h1>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">
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
                ×
              </button>
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
                disabled={resultStatus === 'Không đạt' && !reason.trim() || !stampedFileName}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors"
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