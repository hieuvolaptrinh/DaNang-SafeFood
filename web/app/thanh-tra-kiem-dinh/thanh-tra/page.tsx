'use client';

import { useEffect, useMemo, useState } from 'react';
import ThanhTraList from '@/components/ThanhTraList';
import ThanhTraDetail from '@/components/ThanhTraDetail';
import ThanhTraForm from '@/components/ThanhTraForm';
import {
  mockLichThanhTra,
  mockNguoiThanhTra,
  mockCoSo,
  type LichThanhTra,
  type ThanhTraStatus,
} from '@/data/mockData';

type ScreenState = 'loading' | 'empty' | 'error' | 'data';
type ActiveTab = 'list' | 'create';

export default function ThanhTraPage() {
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [items, setItems] = useState<LichThanhTra[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('list');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (mockLichThanhTra.length === 0) {
        setScreenState('empty');
        return;
      }
      setItems(mockLichThanhTra);
      setSelectedId(mockLichThanhTra[0].maThanhTra);
      setScreenState('data');
    }, 700);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedItem = useMemo(
    () => items.find((i) => i.maThanhTra === selectedId) ?? null,
    [items, selectedId]
  );

  const isNotFound =
    screenState === 'data' && Boolean(selectedId) && selectedItem === null;

  const handleSelect = (item: LichThanhTra) => {
    setSelectedId(item.maThanhTra);
    setSuccessMessage('');
  };

  const handleResetSelection = () => {
    if (items.length > 0) {
      setSelectedId(items[0].maThanhTra);
    }
  };

  const handleCreateSubmit = (data: {
    maCoSo: string;
    noiDung: string;
    maNguoiPhuTrach: string;
  }) => {
    const coSo = mockCoSo.find((c) => c.maCoSo === data.maCoSo);
    const nguoi = mockNguoiThanhTra.find((n) => n.maNguoiDung === data.maNguoiPhuTrach);

    const newItem: LichThanhTra = {
      maThanhTra: `TT-${Date.now()}`,
      trangThai: 'Dang xu ly',
      noiDung: data.noiDung,
      ngayTao: new Date().toISOString().slice(0, 10),
      maCoSo: data.maCoSo,
      tenCoSo: coSo?.tenCoSo ?? '',
      diaChi: coSo?.diaChi ?? '',
      maNguoiPhuTrach: nguoi?.maNguoiDung ?? null,
      tenNguoiPhuTrach: nguoi?.hoTen ?? null,
    };

    setItems((prev) => [newItem, ...prev]);
    setSelectedId(newItem.maThanhTra);
    setSuccessMessage('Tạo lịch thanh tra thành công');
    setActiveTab('list');
  };

  const handleUpdateSubmit = (data: {
    ketQuaKiemTra: string;
    trangThai: ThanhTraStatus;
  }) => {
    if (!selectedItem) return;
    setItems((prev) =>
      prev.map((i) =>
        i.maThanhTra === selectedItem.maThanhTra
          ? { ...i, trangThai: data.trangThai, ketQuaKiemTra: data.ketQuaKiemTra }
          : i
      )
    );
    setSuccessMessage('Cập nhật kết quả thành công');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">Thanh tra</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Theo dõi lịch thanh tra, tạo đơn mới và cập nhật kết quả kiểm tra.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab toggle */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => { setActiveTab('list'); setSuccessMessage(''); }}
              className={`rounded-md px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                activeTab === 'list'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Danh sách
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('create'); setSuccessMessage(''); }}
              className={`rounded-md px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                activeTab === 'create'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              + Tạo mới
            </button>
          </div>
        </div>
      </div>

      {/* States */}
      {screenState === 'loading' && (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 shadow-sm">
          Đang tải danh sách thanh tra...
        </div>
      )}

      {screenState === 'empty' && (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Chưa có lịch thanh tra nào</p>
          <p className="mt-1 text-sm text-slate-500">Tạo lịch thanh tra đầu tiên để bắt đầu.</p>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Tạo lịch thanh tra
          </button>
        </div>
      )}

      {screenState === 'data' && (
        <>
          {activeTab === 'list' && (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <ThanhTraList
                items={items}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
              <div className="space-y-6">
                <ThanhTraDetail
                  item={selectedItem}
                  notFound={isNotFound}
                  onResetSelection={handleResetSelection}
                />
                <ThanhTraForm
                  mode="update"
                  selectedItem={selectedItem}
                  nguoiThanhTraList={mockNguoiThanhTra}
                  coSoList={mockCoSo}
                  onCreateSubmit={handleCreateSubmit}
                  onUpdateSubmit={handleUpdateSubmit}
                  successMessage={successMessage}
                />
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-xl">
              <ThanhTraForm
                mode="create"
                selectedItem={null}
                nguoiThanhTraList={mockNguoiThanhTra}
                coSoList={mockCoSo}
                onCreateSubmit={handleCreateSubmit}
                onUpdateSubmit={handleUpdateSubmit}
                successMessage={successMessage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}