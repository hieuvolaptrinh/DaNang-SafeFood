'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiDownload, FiEye, FiRefreshCw } from 'react-icons/fi';
import Badge from '@/components/Badge';
import DataTable, { type Column } from '@/components/DataTable';
import { GovBtn } from '@/components/GovUI';
import StatCard from '@/components/StatCard';
import TableCard, { FilterSelect, Pagination, SearchInput } from '@/components/TableCard';
import {
  ketQuaKiemNghiemApi,
  type KetQuaKiemNghiemChiTieuResponse,
  type KetQuaKiemNghiemDetailResponse,
  type KetQuaKiemNghiemItemResponse,
  type KetQuaKiemNghiemStatsResponse,
} from '@/api/api';

interface ResultParameter {
  id: string;
  name: string;
  measuredValue: string;
  allowedLimit: string;
  conclusion: 'pass' | 'fail' | 'pending';
}

interface TestResult {
  id: string;
  business: string;
  sampleName: string;
  sampleType: string;
  testDate: string;
  lab: string;
  result: 'pass' | 'fail' | 'pending';
  parameters: ResultParameter[];
  score: number;
  fileName?: string;
}

const RESULT_CONFIG: Record<
  TestResult['result'],
  { label: string; badgeVariant: 'pass' | 'fail' | 'pending' }
> = {
  pass: { label: 'Đạt', badgeVariant: 'pass' },
  fail: { label: 'Không đạt', badgeVariant: 'fail' },
  pending: { label: 'Chờ kết quả', badgeVariant: 'pending' },
};

function normalizeResult(value?: string | null): TestResult['result'] {
  const normalized = (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  if (normalized.includes('khong dat')) {
    return 'fail';
  }
  if (normalized.includes('dat')) {
    return 'pass';
  }
  return 'pending';
}

function formatDate(value?: string | null) {
  if (!value) {
    return 'Chưa có';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('vi-VN').format(date);
}

function mapChiTieu(item: KetQuaKiemNghiemChiTieuResponse): ResultParameter {
  return {
    id: item.maChiTieu,
    name: item.tenChiTieu || 'Chỉ tiêu',
    measuredValue: item.giaTriDo || 'Chưa có',
    allowedLimit: item.gioiHanChoPhep || 'Chưa có',
    conclusion: normalizeResult(item.ketLuan),
  };
}

function mapItem(item: KetQuaKiemNghiemItemResponse): TestResult {
  return {
    id: item.maKetQua,
    business: item.tenCoSo || 'Chưa rõ',
    sampleName: item.tenMau || item.maMau,
    sampleType: item.loaiMau || 'Chưa rõ',
    testDate: formatDate(item.ngayKiemNghiem),
    lab: item.phongLab || 'Chưa có',
    result: normalizeResult(item.ketQua),
    parameters: (item.chiTieu || '')
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name, index) => ({
        id: `${item.maKetQua}-${index}`,
        name,
        measuredValue: 'Chưa có',
        allowedLimit: 'Chưa có',
        conclusion: normalizeResult(item.ketQua),
      })),
    score: item.diem ?? 0,
    fileName: item.fileKetQua || undefined,
  };
}

function mapDetail(item: KetQuaKiemNghiemDetailResponse): TestResult {
  return {
    id: item.maKetQua,
    business: item.tenCoSo || 'Chưa rõ',
    sampleName: item.tenMau || item.maMau,
    sampleType: item.loaiMau || 'Chưa rõ',
    testDate: formatDate(item.ngayKiemNghiem),
    lab: item.phongLab || 'Chưa có',
    result: normalizeResult(item.ketQua),
    parameters: item.chiTietChiTieu.map(mapChiTieu),
    score: item.diem ?? 0,
    fileName: item.fileKetQua || undefined,
  };
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
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
      <div
        id={id}
        className="flex min-h-10 items-center border border-slate-300 bg-slate-50 px-3 py-2 text-[13px] font-medium text-slate-700"
      >
        {value}
      </div>
    </div>
  );
}

function DetailSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border border-slate-300 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-[13px] font-bold uppercase tracking-[0.04em] text-emerald-800">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ViewResultDetail({
  data,
  onBack,
  onRetest,
}: {
  data: TestResult;
  onBack: () => void;
  onRetest: () => void;
}) {
  const resultConfig = RESULT_CONFIG[data.result];

  return (
    <div className="result-view-transition space-y-6">
      <TableCard
        title="Chi tiết kết quả kiểm nghiệm"
        actions={
          <div className="flex gap-2">
            <GovBtn variant="warning" onClick={onRetest}>
              <FiRefreshCw size={14} />
              Yêu cầu kiểm nghiệm lại
            </GovBtn>
            <GovBtn variant="secondary" onClick={onBack}>
              <FiArrowLeft size={14} />
              Quay lại
            </GovBtn>
          </div>
        }
      >
        <div className="space-y-6 p-5">
          <DetailSection
            title="1. Thông tin mẫu"
            description="Thông tin mẫu và cơ sở được hiển thị ở chế độ chỉ đọc."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ReadOnlyField id="sampleName" label="Tên mẫu" value={data.sampleName} />
              <ReadOnlyField id="sampleType" label="Loại mẫu" value={data.sampleType} />
              <ReadOnlyField id="business" label="Cơ sở" value={data.business} />
              <ReadOnlyField id="testDate" label="Ngày kiểm nghiệm" value={data.testDate} />
            </div>
          </DetailSection>

          <DetailSection
            title="2. Kết quả kiểm nghiệm"
            description="Danh sách chỉ tiêu đo lường và kết luận cho từng chỉ tiêu."
          >
            <div className="overflow-hidden border border-slate-300">
              <div className="grid grid-cols-[1.3fr_1fr_1fr_120px] border-b border-slate-300 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                <span>Tên chỉ tiêu</span>
                <span>Giá trị đo</span>
                <span>Giới hạn cho phép</span>
                <span>Kết luận</span>
              </div>
              <div className="divide-y divide-slate-300">
                {data.parameters.map((parameter) => (
                  <div
                    key={parameter.id}
                    className="grid grid-cols-[1.3fr_1fr_1fr_120px] items-center px-4 py-3 text-sm text-slate-700"
                  >
                    <span className="font-medium text-slate-900">{parameter.name}</span>
                    <span>{parameter.measuredValue}</span>
                    <span>{parameter.allowedLimit}</span>
                    <span>
                      <Badge
                        variant={parameter.conclusion}
                        label={parameter.conclusion === 'pass' ? 'Đạt' : parameter.conclusion === 'fail' ? 'Không đạt' : 'Chờ kết quả'}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DetailSection>

          <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <DetailSection
              title="3. Kết luận chung"
              description="Kết luận tổng hợp cho toàn bộ mẫu kiểm nghiệm."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel>Kết luận</FieldLabel>
                  <div className="flex h-10 items-center border border-slate-300 bg-slate-50 px-3">
                    <Badge variant={resultConfig.badgeVariant} label={resultConfig.label} />
                  </div>
                </div>
                <ReadOnlyField id="lab" label="Phòng lab" value={data.lab} />
              </div>
            </DetailSection>

            <DetailSection
              title="4. File kết quả"
              description="Hiển thị tệp PDF hoặc tên file kết quả."
            >
              <ReadOnlyField
                id="fileName"
                label="Tên file"
                value={data.fileName ?? 'Chưa có file kết quả'}
              />
            </DetailSection>
          </section>
        </div>
      </TableCard>
    </div>
  );
}

function normalizeError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

const EMPTY_STATS: KetQuaKiemNghiemStatsResponse = {
  tongMau: 0,
  datChuan: 0,
  khongDat: 0,
  choKetQua: 0,
};

export default function KetQuaPage() {
  const router = useRouter();
  const [maKetQua, setMaKetQua] = useState('');
  const [coSo, setCoSo] = useState('');
  const [tenMau, setTenMau] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [mode, setMode] = useState<'list' | 'view'>('list');
  const [results, setResults] = useState<TestResult[]>([]);
  const [stats, setStats] = useState<KetQuaKiemNghiemStatsResponse>(EMPTY_STATS);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [statsData, pageData] = await Promise.all([
        ketQuaKiemNghiemApi.getStats(),
        ketQuaKiemNghiemApi.search('', '', 0, 100),
      ]);
      setStats(statsData);
      setResults(pageData.content.map(mapItem));
    } catch (error) {
      setErrorMessage(normalizeError(error, 'Không thể tải dữ liệu kết quả kiểm nghiệm'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filtered = useMemo(
    () =>
      results.filter((result) => {
        const matchMaKetQua =
          !maKetQua || result.id.toLowerCase().includes(maKetQua.toLowerCase());

        const matchCoSo =
          !coSo || result.business.toLowerCase().includes(coSo.toLowerCase());

        const matchTenMau =
          !tenMau || result.sampleName.toLowerCase().includes(tenMau.toLowerCase());

        const matchResult = !resultFilter || result.result === resultFilter;
        return matchMaKetQua && matchCoSo && matchTenMau && matchResult;
      }),
    [resultFilter, results, maKetQua, coSo, tenMau]
  );

  const columns: Column<TestResult>[] = [
    {
      key: 'id',
      header: 'Mã kết quả',
      render: (result) => <span className="font-mono text-[12px] text-slate-500">{result.id}</span>,
    },
    {
      key: 'business',
      header: 'Cơ sở',
      render: (result) => <strong className="text-slate-800">{result.business}</strong>,
    },
    { key: 'sampleType', header: 'Loại mẫu' },
    { key: 'testDate', header: 'Ngày kiểm nghiệm' },
    { key: 'lab', header: 'Phòng lab' },
    {
      key: 'result',
      header: 'Kết quả',
      render: (result) => {
        const config = RESULT_CONFIG[result.result];
        return <Badge variant={config.badgeVariant} label={config.label} />;
      },
    },
    {
      key: 'parameters',
      header: 'Chỉ tiêu',
      render: (result) => (
        <span className="text-slate-600">{result.parameters.map((parameter) => parameter.name).join(', ')}</span>
      ),
    },
    {
      key: 'score',
      header: 'Điểm',
      render: (result) => (
        <span
          className={`font-bold ${
            result.score >= 80 ? 'text-emerald-600' : result.score >= 60 ? 'text-amber-600' : 'text-red-600'
          }`}
        >
          {result.score}/100
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (result) => (
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={async () => {
              try {
                const detail = await ketQuaKiemNghiemApi.getById(result.id);
                setSelectedResult(mapDetail(detail));
                setMode('view');
              } catch (error) {
                setErrorMessage(normalizeError(error, 'Không thể tải chi tiết kết quả'));
              }
            }}
            className="h-7 w-7 rounded-md border border-slate-200 bg-white text-sm transition-colors hover:bg-slate-50"
            title="Xem chi tiết"
          >
            <FiEye size={16} className="mx-auto" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">Kết quả Kiểm nghiệm</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">Kết quả kiểm nghiệm mẫu thực phẩm và môi trường</p>
        </div>
        {mode === 'list' && (
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
              onClick={() => void loadData()}
            >
              <FiRefreshCw size={14} />
              Làm mới
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
              <FiDownload size={14} />
              Xuất Excel
            </button>
          </div>
        )}
      </div>

      {errorMessage && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}

      {mode === 'view' && selectedResult ? (
        <ViewResultDetail
          data={selectedResult}
          onBack={() => {
            setSelectedResult(null);
            setMode('list');
          }}
          onRetest={() => router.push('/thanh-tra-kiem-dinh/yeu-cau')}
        />
      ) : (
        <div className="result-view-transition space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Tổng mẫu" value={stats.tongMau} color="blue" />
            <StatCard label="Đạt chuẩn" value={stats.datChuan} color="green" />
            <StatCard label="Không đạt" value={stats.khongDat} color="red" />
            <StatCard label="Chờ kết quả" value={stats.choKetQua} color="orange" />
          </div>

          <TableCard
            title="Kết quả kiểm nghiệm"
            controls={
              <>
                <SearchInput placeholder="Mã kết quả" onChange={setMaKetQua} />
                <SearchInput placeholder="Cơ sở" onChange={setCoSo} />
                <SearchInput placeholder="Tên mẫu" onChange={setTenMau} />
                <FilterSelect
                  options={[
                    { value: '', label: 'Tất cả kết quả' },
                    { value: 'pass', label: 'Đạt chuẩn' },
                    { value: 'fail', label: 'Không đạt' },
                    { value: 'pending', label: 'Chờ kết quả' },
                  ]}
                  onChange={setResultFilter}
                />
              </>
            }
            footer={<Pagination info={`Hiển thị ${filtered.length} trong tổng số ${results.length} kết quả`} />}
          >
            <DataTable
              columns={columns}
              data={filtered}
              emptyMessage={isLoading ? 'Đang tải dữ liệu kết quả...' : 'Không tìm thấy kết quả nào'}
            />
          </TableCard>
        </div>
      )}

      <style jsx>{`
        @keyframes resultViewFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .result-view-transition {
          animation: resultViewFade 0.22s ease-out;
        }
      `}</style>
    </div>
  );
}
