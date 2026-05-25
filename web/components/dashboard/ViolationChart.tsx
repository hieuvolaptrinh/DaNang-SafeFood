'use client';

import { useEffect, useState } from 'react';
import { thongKeApi, ViPhamTheoThang } from '@/api/api';

const FALLBACK: ViPhamTheoThang = {
  danhSach: [
    { thangNam: 'T10/2025', soVu: 5 },
    { thangNam: 'T11/2025', soVu: 8 },
    { thangNam: 'T12/2025', soVu: 6 },
    { thangNam: 'T1/2026', soVu: 9 },
    { thangNam: 'T2/2026', soVu: 4 },
    { thangNam: 'T3/2026', soVu: 7 },
    { thangNam: 'T4/2026', soVu: 11 },
    { thangNam: 'T5/2026', soVu: 3 },
  ],
  tongSoVu: 53,
  binhQuanMoiThang: 6.6,
  thangCaoNhat: 'T4/2026',
  soVuCaoNhat: 11,
};

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getLast6Months(): { from: string; to: string } {
  const now = new Date();
  const from = formatDate(new Date(now.getFullYear(), now.getMonth() - 5, 1));
  const to = formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  return { from, to };
}

export default function ViolationChart() {
  const [data, setData] = useState<ViPhamTheoThang>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { from, to } = getLast6Months();
    thongKeApi.getViPhamTheoThang(from, to)
      .then(res => {
        setData(res);
      })
      .catch(() => setData(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const months = loading ? FALLBACK.danhSach : (data.danhSach?.length ? data.danhSach : FALLBACK.danhSach);
  const max = Math.max(...months.map(m => m.soVu), 1);

  return (
    <div style={{ padding: '12px' }}>
      {/* Bar chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', marginBottom: '8px', borderBottom: '1px solid #D6D6D6', padding: '0 4px 4px 4px' }}>
        {months.map(m => {
          const pct = (m.soVu / max) * 100;
          const color = m.soVu >= 10 ? '#CC0000' : m.soVu >= 7 ? '#CC6600' : '#008000';
          return (
            <div key={m.thangNam} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, color }}>{m.soVu}</span>
              <div style={{ width: '100%', background: '#E8E8E8', borderRadius: '1px', height: '100px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: `${pct}%`, background: color, transition: 'height 0.3s' }} />
              </div>
            </div>
          );
        })}
      </div>
      {/* X-axis labels */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {months.map(m => (
          <div key={m.thangNam} style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden' }}>{m.thangNam}</div>
        ))}
      </div>
      {/* Summary */}
      <div style={{ marginTop: '10px', padding: '8px 10px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '1px', display: 'flex', gap: '16px', fontSize: '12px', color: '#555', flexWrap: 'wrap' }}>
        <span>Tổng: <strong style={{ color: '#222' }}>{data.tongSoVu} vụ</strong></span>
        <span>Bình quân: <strong style={{ color: '#222' }}>{data.binhQuanMoiThang?.toFixed(1)} vụ/tháng</strong></span>
        <span>Cao nhất: <strong style={{ color: '#CC0000' }}>{data.soVuCaoNhat} vụ ({data.thangCaoNhat})</strong></span>
      </div>
    </div>
  );
}
