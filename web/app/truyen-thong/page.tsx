'use client';

import Link from 'next/link';
import { PageHeader, SectionCard, GovBtn } from '@/components/GovUI';
import { FileText, Bell, AlertTriangle } from 'lucide-react';

export default function TruyenThongPage() {
  const items = [
    {
      icon: FileText,
      title: 'Quy định pháp luật',
      desc: 'Thư viện văn bản quy phạm pháp luật về an toàn thực phẩm',
      href: '/truyen-thong/quy-dinh',
      borderColor: '#005A9E',
    },
    {
      icon: Bell,
      title: 'Thông báo',
      desc: 'Thông báo công khai đến các cơ sở kinh doanh thực phẩm',
      href: '/truyen-thong/thong-bao',
      borderColor: '#008000',
    },
    {
      icon: AlertTriangle,
      title: 'Cảnh báo ATTP',
      desc: 'Cảnh báo khẩn cấp về nguy cơ an toàn thực phẩm',
      href: '/truyen-thong/canh-bao',
      borderColor: '#CC0000',
    },
  ];

  const recentActivities = [
    { action: 'Đăng thông báo mới:', target: 'Yêu cầu kiểm tra định kỳ Q1/2025', time: '14/01/2025 08:00', type: 'thong-bao' },
    { action: 'Cập nhật quy định:', target: 'Nghị định 15/2018/NĐ-CP sửa đổi', time: '10/01/2025 14:30', type: 'quy-dinh' },
    { action: 'Cảnh báo phát đi:', target: 'Nguy cơ ngộ độc từ hải sản khu vực Sơn Trà', time: '08/01/2025 09:15', type: 'canh-bao' },
  ];

  const typeColors: Record<string, { bg: string; color: string; border: string }> = {
    'thong-bao': { bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
    'quy-dinh':  { bg: '#EAF7EA', color: '#006400', border: '#94C994' },
    'canh-bao':  { bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  };

  return (
    <div>
      <PageHeader
        title="Truyền thông & Thông tin ATTP"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Quản lý thông tin và truyền thông về an toàn thực phẩm"
      />

      {/* Navigation cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '12px' }}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="gov-nav-card"
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
                <div>
                  <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#222', marginBottom: '4px' }}>
                    {item.title}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>{item.desc}</p>
                </div>
              </div>
              <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <GovBtn variant="outline" size="sm">Xem danh sách →</GovBtn>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent activity */}
      <SectionCard title="Hoạt động truyền thông gần đây">
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
                  {item.type === 'thong-bao' ? 'Thông báo' : item.type === 'quy-dinh' ? 'Quy định' : 'Cảnh báo'}
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
