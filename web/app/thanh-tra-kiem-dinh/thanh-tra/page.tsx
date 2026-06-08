'use client';

import { useEffect, useMemo, useState } from 'react';
import ThanhTraList from '@/components/ThanhTraList';
import ThanhTraDetail from '@/components/ThanhTraDetail';
import ThanhTraForm from '@/components/ThanhTraForm';
import { thanhTraApi } from '@/api/thanhtra';
import { coSoKinhDoanhApi } from '@/api/cosokinhdoanh';
import type { ThanhTraItem } from '@/api/thanhtra';
import type { CoSoKinhDoanhItem } from '@/api/cosokinhdoanh';
import type { CanBoThanhTraItem } from '@/api/thanhtra';

type ScreenState = 'loading' | 'empty' | 'error' | 'data';
type ActiveTab = 'list' | 'create';

export default function ThanhTraPage() {
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [items, setItems] = useState<ThanhTraItem[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('list');
  const [successMessage, setSuccessMessage] = useState('');

  // Dropdown lists state
  const [coSoList, setCoSoList] = useState<CoSoKinhDoanhItem[]>([]);
  const [inspectors, setInspectors] = useState<CanBoThanhTraItem[]>([]);

  const loadData = async () => {
    setScreenState('loading');
    try {
      const res = await thanhTraApi.getList({ page: 0, size: 100 });
      const content = res.content || [];
      setItems(content);
      if (content.length > 0) {
        setItems(content);
        setSelectedId(content[0].maThanhTra);
        setScreenState('data');
      } else {
        setItems([]);
        setScreenState('empty');
      }
    } catch (err) {
      console.error('Lỗi tải danh sách thanh tra:', err);
      setScreenState('error');
    }
  };

  useEffect(() => {
    loadData();

    // Fetch dropdowns
    coSoKinhDoanhApi.getDropdown()
      .then(setCoSoList)
      .catch(err => console.error('Lỗi tải danh sách cơ sở kinh doanh:', err));

    thanhTraApi.getCanBoThanhTra()
      .then(setInspectors)
      .catch(err => console.error('Lỗi tải danh sách cán bộ thanh tra:', err));
  }, []);

  const selectedItem = useMemo(
    () => items.find((i) => i.maThanhTra === selectedId) ?? null,
    [items, selectedId]
  );

  const isNotFound =
    screenState === 'data' && Boolean(selectedId) && selectedItem === null;

  const handleSelect = (item: ThanhTraItem) => {
    setSelectedId(item.maThanhTra);
    setSuccessMessage('');
  };

  const handleResetSelection = () => {
    if (items.length > 0) {
      setSelectedId(items[0].maThanhTra);
    }
  };

  const handleCreateSubmit = async (data: {
    maCoSo: string;
    noiDung: string;
    maNguoiPhuTrach: string;
  }) => {
    try {
      setSuccessMessage('');
      const newItem = await thanhTraApi.create(data);
      setItems((prev) => [newItem, ...prev]);
      setSelectedId(newItem.maThanhTra);
      setSuccessMessage('Tạo lịch thanh tra thành công');
      setScreenState('data');
      setActiveTab('list');
    } catch (err: any) {
      console.error('Lỗi tạo lịch thanh tra:', err);
      alert(err.message || 'Có lỗi xảy ra khi tạo lịch thanh tra. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">Thanh tra</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Theo dõi lịch thanh tra, phân công và ban hành lịch thanh tra cơ sở kinh doanh.
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

      {/* Views */}
      {activeTab === 'create' && (
        <div className="max-w-xl">
          <ThanhTraForm
            coSoList={coSoList}
            nguoiThanhTraList={inspectors}
            onCreateSubmit={handleCreateSubmit}
            successMessage={successMessage}
          />
        </div>
      )}

      {activeTab === 'list' && (
        <>
          {screenState === 'loading' && (
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 shadow-sm">
              Đang tải danh sách thanh tra...
            </div>
          )}

          {screenState === 'error' && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-10 text-center text-sm text-red-600 shadow-sm">
              Lỗi khi kết nối tới máy chủ. Vui lòng kiểm tra lại server.
            </div>
          )}

          {screenState === 'empty' && (
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-700">Chưa có lịch thanh tra nào</p>
              <p className="mt-1 text-sm text-slate-500">Tạo lịch thanh tra đầu tiên để bắt đầu.</p>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition-colors"
              >
                Tạo lịch thanh tra
              </button>
            </div>
          )}

          {screenState === 'data' && (
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
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}