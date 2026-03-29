'use client';

import DataTable, { type Column } from '@/components/DataTable';
import TableCard, { Pagination } from '@/components/TableCard';
import ComplaintStatusBadge from '@/components/ComplaintStatusBadge';
import type { ComplaintRecord } from '@/data/mockData';

interface ComplaintListProps {
  complaints: ComplaintRecord[];
  selectedComplaintId: string;
  onSelect: (complaint: ComplaintRecord) => void;
}

export default function ComplaintList({
  complaints,
  selectedComplaintId,
  onSelect,
}: ComplaintListProps) {
  const columns: Column<ComplaintRecord>[] = [
    {
      key: 'title',
      header: 'Tiêu đề khiếu nại',
      render: (complaint) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">{complaint.title}</p>
          <p className="font-mono text-[12px] text-slate-400">{complaint.id}</p>
        </div>
      ),
    },
    {
      key: 'submitter',
      header: 'Người gửi',
      render: (complaint) => (
        <div>
          <p className="font-medium text-slate-800">{complaint.submitter}</p>
          <p className="text-[12px] text-slate-500">{complaint.submitterInfo.phone}</p>
        </div>
      ),
    },
    { key: 'submittedAt', header: 'Ngày gửi' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (complaint) => <ComplaintStatusBadge status={complaint.status} />,
    },
  ];

  return (
    <TableCard
      title="Danh sách khiếu nại"
      footer={
        <Pagination
          info={`Hiển thị 1–${complaints.length} trong tổng số ${complaints.length} khiếu nại`}
        />
      }
    >
      <DataTable
        columns={columns}
        data={complaints}
        rowKey={(complaint) => complaint.id}
        onRowClick={onSelect}
        rowClassName={(complaint) =>
          complaint.id === selectedComplaintId ? 'bg-blue-50/80 hover:!bg-blue-50' : ''
        }
        emptyMessage="Chưa có khiếu nại nào"
      />
    </TableCard>
  );
}
