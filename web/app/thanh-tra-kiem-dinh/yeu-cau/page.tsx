'use client';

import { useState } from 'react';
import Badge from '@/components/Badge';
import CreateInspectionRequestForm, {
  type FoodInspectionRequestRecord,
} from '@/components/CreateInspectionRequestForm';
import DataTable, { type Column } from '@/components/DataTable';
import AlertBanner from '@/components/AlertBanner';
import TableCard, { FilterSelect, Pagination, SearchInput } from '@/components/TableCard';

const mockTestRequests: FoodInspectionRequestRecord[] = [
  {
    id: 'YC-2025001',
    business: 'Nhà hàng Hải Sản Biển Xanh',
    sampleType: 'Mẫu thực phẩm tươi',
    requestDate: '23/03/2025',
    deadline: '30/03/2025',
    status: 'processing',
    lab: 'Trung tâm Kiểm nghiệm Đà Nẵng',
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
  },
];

export default function YeuCauPage() {
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [requests, setRequests] = useState<FoodInspectionRequestRecord[]>(mockTestRequests);
  const [selectedSampleId] = useState('SAMPLE-2025-001');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const filtered = requests.filter((request) => {
    const matchSearch =
      !search ||
      request.business.toLowerCase().includes(search.toLowerCase()) ||
      request.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || request.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<FoodInspectionRequestRecord>[] = [
    {
      key: 'id',
      header: 'Mã yêu cầu',
      render: (request) => <span className="font-mono text-[12px] text-slate-500">{request.id}</span>,
    },
    {
      key: 'business',
      header: 'Cơ sở',
      render: (request) => <strong className="text-slate-800">{request.business}</strong>,
    },
    { key: 'sampleType', header: 'Loại mẫu' },
    { key: 'requestDate', header: 'Ngày yêu cầu' },
    { key: 'deadline', header: 'Hạn hoàn thành' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (request) => <Badge variant={request.status} />,
    },
    { key: 'lab', header: 'Phòng lab' },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <div className="flex gap-1.5">
          <button className="h-7 w-7 rounded-md border border-slate-200 bg-white text-sm transition-colors hover:bg-slate-50">
            👁
          </button>
          <button className="h-7 w-7 rounded-md border border-slate-200 bg-white text-sm transition-colors hover:bg-slate-50">
            ✏️
          </button>
        </div>
      ),
    },
  ];

  const handleCreateClick = () => {
    setFeedbackMessage('');
    setMode('create');
  };

  const handleCancelCreate = () => {
    setMode('list');
  };

  const handleCreateSuccess = (request: FoodInspectionRequestRecord) => {
    setRequests((current) => [request, ...current]);
    setMode('list');
    setFeedbackMessage('Đơn kiểm định đã được tạo và gửi thành công');
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">
            Yêu cầu Kiểm nghiệm
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Quản lý các yêu cầu kiểm nghiệm mẫu từ cơ sở kinh doanh
          </p>
        </div>

        {mode === 'list' && (
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
              📥 Xuất danh sách
            </button>
            <button
              type="button"
              onClick={handleCreateClick}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-blue-700"
            >
              + Tạo yêu cầu mới
            </button>
          </div>
        )}
      </div>

      {mode === 'create' ? (
        <CreateInspectionRequestForm
          selectedSampleId={selectedSampleId}
          onCancel={handleCancelCreate}
          onSuccess={handleCreateSuccess}
        />
      ) : (
        <>
          {feedbackMessage && <AlertBanner type="success" title={feedbackMessage} />}

          <TableCard
            title="Danh sách yêu cầu kiểm nghiệm"
            controls={
              <>
                <SearchInput placeholder="Tìm cơ sở, mã yêu cầu..." onChange={setSearch} />
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
            footer={
              <Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${requests.length} yêu cầu`} />
            }
          >
            <DataTable columns={columns} data={filtered} emptyMessage="Không tìm thấy yêu cầu nào" />
          </TableCard>
        </>
      )}
    </div>
  );
}
