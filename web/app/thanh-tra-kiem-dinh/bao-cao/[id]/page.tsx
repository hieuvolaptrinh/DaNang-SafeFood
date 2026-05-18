import Link from 'next/link';
import AlertBanner from '@/components/AlertBanner';
import Badge from '@/components/Badge';
import TableCard from '@/components/TableCard';
import { mockInspectionReports } from '@/data/mockData';

function InfoField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border border-slate-300 bg-slate-50 px-4 py-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="text-sm font-medium text-slate-800">{value}</div>
    </div>
  );
}

export default async function BaoCaoChiTietPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = mockInspectionReports.find((item) => item.id === id);

  if (!report) {
    return (
      <div>
        <AlertBanner type="danger" title={`Không tìm thấy báo cáo ${id}`} />
        <Link
          href="/thanh-tra-kiem-dinh/bao-cao"
          className="inline-flex border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Quay lại
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">Chi tiết báo cáo thanh tra</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Xem chi tiết báo cáo ở chế độ chỉ đọc.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/thanh-tra-kiem-dinh/bao-cao"
            className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Quay lại
          </Link>
          <Link
            href={`/thanh-tra-kiem-dinh/bao-cao/${report.id}/edit`}
            className="border border-sky-700 bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-800"
          >
            Chỉnh sửa
          </Link>
        </div>
      </div>

      <TableCard title="Thông tin báo cáo">
        <div className="grid gap-5 p-5 md:grid-cols-2">
          <InfoField label="Mã báo cáo" value={<span className="font-mono">{report.id}</span>} />
          <InfoField label="Tên cơ sở" value={report.tenCoSo} />
          <InfoField label="Ngày kiểm tra" value={report.ngay} />
          <InfoField label="Kết quả" value={<Badge variant={report.ketQua} />} />
          <InfoField
            label="File báo cáo"
            value={report.tepDinhKem ?? 'Chưa có tệp đính kèm'}
          />

          <div className="space-y-2 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nội dung báo cáo</p>
            <div className="border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              {report.noiDung}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nhận xét</p>
            <div className="border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              {report.nhanXet}
            </div>
          </div>
        </div>
      </TableCard>
    </div>
  );
}
