'use client';

import { useState } from 'react';
import type { CanBoThanhTraItem } from '@/api/thanhtra';
import type { CoSoKinhDoanhItem } from '@/api/cosokinhdoanh';

interface CreateFormState {
  maCoSo: string;
  noiDung: string;
  maNguoiPhuTrach: string;
}

interface ThanhTraFormProps {
  coSoList: CoSoKinhDoanhItem[];
  nguoiThanhTraList: CanBoThanhTraItem[];
  onCreateSubmit: (data: CreateFormState) => void;
  successMessage: string;
}

export default function ThanhTraForm({
  coSoList,
  nguoiThanhTraList,
  onCreateSubmit,
  successMessage,
}: ThanhTraFormProps) {
  const [form, setForm] = useState<CreateFormState>({
    maCoSo: '',
    noiDung: '',
    maNguoiPhuTrach: '',
  });
  const [showInspectorModal, setShowInspectorModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCoSo = coSoList.find((c) => c.maCoSo === form.maCoSo);
  const selectedInspector = nguoiThanhTraList.find(
    (n) => n.maNguoiDung === form.maNguoiPhuTrach,
  );
  const filteredInspectors = nguoiThanhTraList.filter(
    (n) =>
      n.hoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.maNguoiDung.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const validation =
    !form.maCoSo
      ? 'Vui lòng chọn cơ sở kinh doanh'
      : !form.noiDung.trim()
        ? 'Vui lòng nhập nội dung thanh tra'
        : '';

  const handleSubmit = () => {
    if (validation) return;
    onCreateSubmit(form);
    setForm({ maCoSo: '', noiDung: '', maNguoiPhuTrach: '' });
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">Tạo lịch thanh tra mới</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">Điền thông tin để tạo đơn thanh tra</p>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Cơ sở kinh doanh dropdown */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
              Cơ sở kinh doanh <span className="text-red-500">*</span>
            </label>
            <select
              value={form.maCoSo}
              onChange={(e) => setForm((f) => ({ ...f, maCoSo: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">-- Chọn cơ sở kinh doanh --</option>
              {coSoList.map((cs) => (
                <option key={cs.maCoSo} value={cs.maCoSo}>
                  {cs.tenCoSo} — {cs.tenPhuongXa}
                </option>
              ))}
            </select>
            {selectedCoSo && (
              <p className="mt-1 text-[11px] text-slate-500">
                Chủ sở hữu: <span className="font-medium">{selectedCoSo.tenChuSoHuu}</span>
                {' · '}GP: <span className="font-medium">{selectedCoSo.soGiayPhep}</span>
              </p>
            )}
          </div>

          {/* Nội dung */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
              Nội dung thanh tra <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={form.noiDung}
              onChange={(e) => setForm((f) => ({ ...f, noiDung: e.target.value }))}
              placeholder="Mô tả nội dung, mục đích của cuộc thanh tra..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          {/* Người phụ trách — modal picker */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
              Cán bộ phụ trách
            </label>
            <button
              type="button"
              onClick={() => setShowInspectorModal(true)}
              className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] shadow-sm hover:bg-slate-50 transition-colors"
            >
              {selectedInspector ? (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                    {selectedInspector.hoTen.split(' ').pop()?.charAt(0)}
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-slate-800">{selectedInspector.hoTen}</span>
                    <span className="ml-2 text-[11px] text-slate-400">
                      {selectedInspector.gioiTinh} · CCCD: {selectedInspector.cccd}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-slate-400 italic">Chọn cán bộ thanh tra...</span>
              )}
              <svg className="h-4 w-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </button>
          </div>

          {validation && (
            <p className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              ⚠ {validation}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!!validation}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Tạo lịch thanh tra
          </button>

          {successMessage && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-[13px] font-semibold text-emerald-700">
              ✓ {successMessage}
            </div>
          )}
        </div>
      </div>

      {/* Inspector Selection Modal */}
      {showInspectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Chọn cán bộ phụ trách</h3>
                <p className="text-[12px] text-slate-500 mt-0.5">Chọn cán bộ thanh tra cho lịch này</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowInspectorModal(false); setSearchQuery(''); }}
                className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-3 border-b border-slate-100">
              <input
                type="text"
                placeholder="Tìm theo tên hoặc mã cán bộ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                autoFocus
              />
            </div>

            <ul className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              <li>
                <button
                  type="button"
                  onClick={() => { setForm((f) => ({ ...f, maNguoiPhuTrach: '' })); setShowInspectorModal(false); setSearchQuery(''); }}
                  className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-[13px] italic text-slate-400">Không phân công</span>
                </button>
              </li>
              {filteredInspectors.map((inspector) => {
                const isSelected = form.maNguoiPhuTrach === inspector.maNguoiDung;
                return (
                  <li key={inspector.maNguoiDung}>
                    <button
                      type="button"
                      onClick={() => { setForm((f) => ({ ...f, maNguoiPhuTrach: inspector.maNguoiDung })); setShowInspectorModal(false); setSearchQuery(''); }}
                      className={`w-full text-left px-5 py-3 transition-colors flex items-center gap-3 ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                    >
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                        {inspector.hoTen.split(' ').pop()?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800">{inspector.hoTen}</p>
                        <p className="text-[11px] text-slate-500">{inspector.gioiTinh} · CCCD: {inspector.cccd}</p>
                      </div>
                      {isSelected && (
                        <svg className="ml-auto h-4 w-4 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
              {filteredInspectors.length === 0 && (
                <li className="px-5 py-6 text-center text-[13px] text-slate-400">
                  Không tìm thấy kết quả
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}