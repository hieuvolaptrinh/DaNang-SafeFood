'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FoodSafetyWarning {
  id: string;
  businessName: string;
  warningType: string;
  level: 'thấp' | 'trung bình' | 'cao';
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'resolved' | 'expired';
  district: string;
}

const LEVEL_CONFIG = {
  thấp: { label: 'Thấp', color: 'text-green-600' },
  'trung bình': { label: 'Trung bình', color: 'text-yellow-600' },
  cao: { label: 'Cao', color: 'text-red-600' },
};

const STATUS_CONFIG = {
  active: {
    label: 'Đang hiệu lực',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: '🟢',
  },
  resolved: {
    label: 'Đã xử lý',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: '✅',
  },
  expired: {
    label: 'Hết hiệu lực',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: '⏰',
  },
};

export default function CreateWarningPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<FoodSafetyWarning>>({
    level: 'trung bình',
    status: 'active',
    district: 'Hải Châu',
    issueDate: new Date().toLocaleDateString('vi-VN'),
  });

  const handleSave = () => {
    if (!formData.businessName || !formData.warningType) {
      alert('Vui lòng nhập đầy đủ!');
      return;
    }

    const newId = `CB-${new Date().getFullYear()}${Math.floor(
      Math.random() * 1000
    )
      .toString()
      .padStart(4, '0')}`;

    console.log('DATA:', { ...formData, id: newId });

    alert(`Tạo thành công! Mã: ${newId}`);

    router.push('/canh-bao');
  };

  const status = formData.status ?? 'active';
  const level = formData.level ?? 'trung bình';

  const statusCfg = STATUS_CONFIG[status];
  const levelCfg = LEVEL_CONFIG[level];

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <div className="max-w-[1100px] mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          Tạo mới cảnh báo
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FORM */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl">
            <input
              placeholder="Tên cơ sở"
              value={formData.businessName || ''}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
              className="w-full border p-3 mb-4 rounded"
            />

            <input
              placeholder="Loại cảnh báo"
              value={formData.warningType || ''}
              onChange={(e) =>
                setFormData({ ...formData, warningType: e.target.value })
              }
              className="w-full border p-3 mb-4 rounded"
            />

            <select
              value={level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  level: e.target.value as 'thấp' | 'trung bình' | 'cao',
                })
              }
              className="w-full border p-3 mb-4 rounded"
            >
              <option value="thấp">Thấp</option>
              <option value="trung bình">Trung bình</option>
              <option value="cao">Cao</option>
            </select>

            <button
              onClick={handleSave}
              className="bg-violet-600 text-white px-6 py-3 rounded"
            >
              Tạo mới
            </button>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl">
            <h3 className="mb-4 font-semibold">Trạng thái</h3>

            <div
              className={`p-4 rounded ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}
            >
              <div className="text-3xl">{statusCfg.icon}</div>
              <div>{statusCfg.label}</div>
            </div>

            <div className={`mt-4 ${levelCfg.color}`}>
              Mức độ: {levelCfg.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}