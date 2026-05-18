'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiDownload, FiEye, FiRefreshCw } from 'react-icons/fi';
import Badge from '@/components/Badge';
import DataTable, { Column } from '@/components/DataTable';
import { GovBtn } from '@/components/GovUI';
import StatCard from '@/components/StatCard';
import TableCard, { FilterSelect, Pagination, SearchInput } from '@/components/TableCard';

interface ResultParameter {
  id: string;
  name: string;
  measuredValue: string;
  allowedLimit: string;
  conclusion: 'pass' | 'fail';
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

const mockTestResults: TestResult[] = [
  {
    id: 'KN-2025001',
    business: 'Nhà hàng Hải Sản Biển Xanh',
    sampleName: 'Mẫu nước rửa khu sơ chế',
    sampleType: 'Mẫu nước rửa',
    testDate: '21/03/2025',
    lab: 'Trung tâm Kiểm nghiệm Đà Nẵng',
    result: 'pass',
    parameters: [
      {
        id: 'PARAM-001',
        name: 'Coliform',
        measuredValue: '1 CFU/100ml',
        allowedLimit: '<= 3 CFU/100ml',
        conclusion: 'pass',
      },
      {
        id: 'PARAM-002',
        name: 'E.coli',
        measuredValue: 'Không phát hiện',
        allowedLimit: 'Không phát hiện',
        conclusion: 'pass',
      },
    ],
    score: 95,
    fileName: 'ket-qua-kn-2025001.pdf',
  },
  {
    id: 'KN-2025002',
    business: 'Quán Ăn Gia Đình Việt',
    sampleName: 'Mẫu chả ram chiên sẵn',
    sampleType: 'Mẫu thực phẩm',
    testDate: '19/03/2025',
    lab: 'Trung tâm Kiểm nghiệm Đà Nẵng',
    result: 'fail',
    parameters: [
      {
        id: 'PARAM-003',
        name: 'Salmonella',
        measuredValue: 'Phát hiện trong 25g',
        allowedLimit: 'Không phát hiện trong 25g',
        conclusion: 'fail',
      },
      {
        id: 'PARAM-004',
        name: 'Tổng số vi sinh vật hiếu khí',
        measuredValue: '2.8 x 10^5 CFU/g',
        allowedLimit: '<= 1 x 10^5 CFU/g',
        conclusion: 'fail',
      },
    ],
    score: 30,
    fileName: 'ket-qua-kn-2025002.pdf',
  },
  {
    id: 'KN-2025003',
    business: 'Cửa hàng Thực phẩm Sạch Organic',
    sampleName: 'Mẫu rau cải bó xôi',
    sampleType: 'Mẫu rau củ',
    testDate: '24/03/2025',
    lab: 'Lab Việt Nam',
    result: 'pass',
    parameters: [
      {
        id: 'PARAM-005',
        name: 'Chì (Pb)',
        measuredValue: '0.02 mg/kg',
        allowedLimit: '<= 0.10 mg/kg',
        conclusion: 'pass',
      },
      {
        id: 'PARAM-006',
        name: 'Cadimi (Cd)',
        measuredValue: '0.01 mg/kg',
        allowedLimit: '<= 0.05 mg/kg',
        conclusion: 'pass',
      },
    ],
    score: 98,
    fileName: 'ket-qua-kn-2025003.pdf',
  },
];

const RESULT_CONFIG: Record<
  TestResult['result'],
  { label: string; badgeVariant: 'pass' | 'fail' | 'pending' }
> = {
  pass: { label: 'Đạt', badgeVariant: 'pass' },
  fail: { label: 'Không đạt', badgeVariant: 'fail' },
  pending: { label: 'Chờ kết quả', badgeVariant: 'pending' },
};

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
                        label={parameter.conclusion === 'pass' ? 'Đạt' : 'Không đạt'}
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

export default function KetQuaPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [mode, setMode] = useState<'list' | 'view'>('list');
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  const filtered = mockTestResults.filter((result) => {
    const matchSearch =
      !search ||
      result.business.toLowerCase().includes(search.toLowerCase()) ||
      result.id.toLowerCase().includes(search.toLowerCase()) ||
      result.sampleName.toLowerCase().includes(search.toLowerCase());
    const matchResult = !resultFilter || result.result === resultFilter;
    return matchSearch && matchResult;
  });

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
            onClick={() => {
              setSelectedResult(result);
              setMode('view');
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

  const total = mockTestResults.length;
  const passed = mockTestResults.filter((result) => result.result === 'pass').length;
  const failed = mockTestResults.filter((result) => result.result === 'fail').length;
  const pending = mockTestResults.filter((result) => result.result === 'pending').length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">Kết quả Kiểm nghiệm</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">Kết quả kiểm nghiệm mẫu thực phẩm và môi trường</p>
        </div>
        {mode === 'list' && (
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
              <FiDownload size={14} />
              Xuất Excel
            </button>
          </div>
        )}
      </div>

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
            <StatCard label="Tổng mẫu" value={total} color="blue" />
            <StatCard label="Đạt chuẩn" value={passed} color="green" />
            <StatCard label="Không đạt" value={failed} color="red" />
            <StatCard label="Chờ kết quả" value={pending} color="orange" />
          </div>

          <TableCard
            title="Kết quả kiểm nghiệm"
            controls={
              <>
                <SearchInput placeholder="Tìm cơ sở, mã kết quả..." onChange={setSearch} />
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
            footer={<Pagination info={`Hiển thị ${filtered.length} trong tổng số ${mockTestResults.length} kết quả`} />}
          >
            <DataTable columns={columns} data={filtered} emptyMessage="Không tìm thấy kết quả nào" />
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
