'use client';

import Link from 'next/link';
import { FlaskConical, FileCheck, ClipboardList } from 'lucide-react';
import { PageHeader, SectionCard, MiniStat } from '@/components/GovUI';

export default function KiemNghiemPage() {
  const items = [
    {
      icon: FlaskConical,
      title: 'Quản lý mẫu kiểm nghiệm',
      desc: 'Tiếp nhận, theo dõi mẫu và cập nhật trạng thái kiểm nghiệm',
      href: '/kiem-nghiem/mau',
      borderColor: '#005A9E',
      count: 5,
      countLabel: 'mẫu đang xử lý',
    },
    {
      icon: FileCheck,
      title: 'Kết quả kiểm nghiệm',
      desc: 'Xem và cập nhật kết quả kiểm nghiệm, cấp chứng nhận',
      href: '/kiem-nghiem/ket-qua',
      borderColor: '#008000',
      count: 3,
      countLabel: 'kết quả mới',
    },
    {
      icon: ClipboardList,
      title: 'Tiêu chí đánh giá ATVSTP',
      desc: 'Ban hành và quản lý tiêu chí đánh giá an toàn vệ sinh thực phẩm',
      href: '/kiem-nghiem/tieu-chi',
      borderColor: '#CC6600',
      count: 5,
      countLabel: 'tiêu chí đang áp dụng',
    },
  ];

  const recentActivities = [
    { action: 'Tiếp nhận mẫu mới:', target: 'Mẫu nước MKN-2025005 từ Cà Phê Thu Hiền', time: '28/12/2024 09:15', type: 'received' },
    { action: 'Kết quả không đạt:', target: 'Mẫu hải sản MKN-2025002 — Phát hiện Salmonella', time: '13/01/2025 14:30', type: 'fail' },
    { action: 'Cấp chứng nhận:', target: 'CN-KN-2025/001 cho Nhà hàng Phở Ba Miền', time: '14/01/2025 10:00', type: 'pass' },
  ];

  const typeColors: Record<string, { bg: string; color: string; border: string }> = {
    'received': { bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
    'pass': { bg: '#EAF7EA', color: '#006400', border: '#94C994' },
    'fail': { bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  };
  const typeLabel: Record<string, string> = {
    received: 'Tiếp nhận',
    pass: 'Đạt',
    fail: 'Không đạt',
  };

  return (
    <div>
      <PageHeader
        title="Kiểm nghiệm thực phẩm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Quản lý toàn bộ quy trình kiểm nghiệm mẫu thực phẩm"
      />

      {/* Stats tổng quan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng mẫu KN" value={5} color="neutral" />
        <MiniStat label="Đang kiểm nghiệm" value={2} color="orange" />
        <MiniStat label="Kết quả đạt" value={3} color="green" />
        <MiniStat label="Không đạt" value={1} color="red" />
      </div>

      {/* Navigation cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '12px' }}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                background: '#fff',
                border: '1px solid #D6D6D6',
                borderTop: `4px solid ${item.borderColor}`,
                borderRadius: '1px',
                padding: '14px',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{
                  width: 36, height: 36, flexShrink: 0,
                  background: '#F5F5F5', border: '1px solid #D6D6D6',
                  borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon style={{ width: 18, height: 18, color: item.borderColor }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>
                    {item.title}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>{item.desc}</p>
                </div>
              </div>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#888' }}>
                  <strong style={{ color: item.borderColor }}>{item.count}</strong> {item.countLabel}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 600, color: item.borderColor,
                  border: `1px solid ${item.borderColor}`, borderRadius: '2px',
                  padding: '2px 8px',
                }}>Xem danh sách →</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Hoạt động gần đây */}
      <SectionCard title="Hoạt động kiểm nghiệm gần đây">
        <div>
          {recentActivities.map((item, i) => {
            const tc = typeColors[item.type];
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '8px 12px',
                  borderBottom: i < recentActivities.length - 1 ? '1px solid #F0F0F0' : 'none',
                }}
              >
                <span style={{
                  display: 'inline-block', padding: '1px 7px', borderRadius: '2px',
                  border: `1px solid ${tc.border}`, background: tc.bg, color: tc.color,
                  fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  {typeLabel[item.type]}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', color: '#333' }}>
                    {item.action} <strong>{item.target}</strong>
                  </p>
                  <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
