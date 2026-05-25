'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { thongKeApi, GiayPhepSapHetHan } from '@/api/api';

const FALLBACK: GiayPhepSapHetHan[] = [
  { maGiayPhep: 'GP-001', tenCoSo: 'Công ty Hải Sản Đà Nẵng', soGiayPhep: 'FSL-2023-0234', tenQuanHuyen: 'Thanh Khê',     ngayHetHan: '2024-11-01', tinhTrang: 'Hết hạn',   soNgayConLai: -196 },
  { maGiayPhep: 'GP-002', tenCoSo: 'Lò Bánh Mì Thanh Khê',    soGiayPhep: 'FSL-2023-0099', tenQuanHuyen: 'Thanh Khê',     ngayHetHan: '2025-02-28', tinhTrang: 'Sắp hết hạn', soNgayConLai: 12 },
  { maGiayPhep: 'GP-003', tenCoSo: 'Bánh Mì Hội An',          soGiayPhep: 'FSL-2024-0087', tenQuanHuyen: 'Sơn Trà',       ngayHetHan: '2025-03-15', tinhTrang: 'Sắp hết hạn', soNgayConLai: 27 },
  { maGiayPhep: 'GP-004', tenCoSo: 'Cà Phê Thu Hiền',         soGiayPhep: 'FSL-2024-0198', tenQuanHuyen: 'Ngũ Hành Sơn', ngayHetHan: '2025-07-01', tinhTrang: 'Sắp hết hạn', soNgayConLai: 46 },
];

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ExpiryAlerts() {
  const [data, setData]       = useState<GiayPhepSapHetHan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    thongKeApi.getGiayPhepSapHetHan(30)
      .then(setData)
      .catch(() => setData(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const rows = loading ? FALLBACK : (data.length ? data : FALLBACK);

  return (
    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12.5px' }}>
      <thead>
        <tr>
          {['Cơ sở', 'Số giấy phép', 'Quận/Huyện', 'Ngày hết hạn', 'Tình trạng', 'Thao tác'].map(h => (
            <th key={h} style={{ background:'#E8E8E8', border:'1px solid #D6D6D6', padding:'5px 10px', fontSize:'11.5px', fontWeight:600, color:'#333', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((a, i) => {
          const isExpired = a.soNgayConLai < 0;
          return (
            <tr key={a.maGiayPhep} style={{ backgroundColor: i % 2 === 1 ? '#FAFAFA' : '#FFF' }}>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontWeight:600, color:'#222' }}>{a.tenCoSo}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontFamily:'monospace', fontSize:'11.5px', color:'#555' }}>{a.soGiayPhep}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', color:'#444' }}>{a.tenQuanHuyen}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontFamily:'monospace', fontSize:'11.5px', color: isExpired ? '#CC0000' : '#CC6600', fontWeight:600 }}>
                {formatDate(a.ngayHetHan)}
              </td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px' }}>
                <span style={{
                  display:'inline-block', padding:'1px 7px', borderRadius:'2px', fontSize:'11px', fontWeight:600, border:'1px solid',
                  ...(isExpired
                    ? { background:'#FDECEA', color:'#CC0000', borderColor:'#F5BCBC' }
                    : { background:'#FFF4E5', color:'#CC6600', borderColor:'#FFCC80' }),
                }}>
                  {isExpired
                    ? `Quá hạn ${Math.abs(a.soNgayConLai)} ngày`
                    : `Còn ${a.soNgayConLai} ngày`}
                </span>
              </td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 8px' }}>
                <button style={{ height:'22px', padding:'0 8px', borderRadius:'2px', background:'#CC6600', color:'#fff', border:'1px solid #aa5500', fontSize:'11px', fontWeight:500, cursor:'pointer' }}>
                  Nhắc nhở
                </button>
              </td>
            </tr>
          );
        })}
        <tr style={{ background:'#EAF7EA' }}>
          <td colSpan={6} style={{ border:'1px solid #D6D6D6', padding:'6px 12px' }}>
            <Link href="/co-so-kinh-doanh/giay-phep" style={{ fontSize:'12px', color:'#008000', fontWeight:600 }}>
              → Xem tất cả giấy phép sắp hết hạn
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
