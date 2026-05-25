'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { thongKeApi, ViPhamGanDay } from '@/api/api';

const FALLBACK: ViPhamGanDay[] = [
  { maViPham: 'VP-001', tenCoSo: 'Nhà hàng Phở Ba Miền',        loaiViPham: 'Vi phạm vệ sinh', mucDo: 'Nghiêm trọng', trangThai: 'Đang xử lý', thoiGianKiemTra: '2026-05-14T09:00:00Z', maHoSo: 'HS-2026-0412' },
  { maViPham: 'VP-002', tenCoSo: 'Bánh Mì Hội An',               loaiViPham: 'Giấy phép hết hạn', mucDo: 'Trung bình', trangThai: 'Chờ xử lý', thoiGianKiemTra: '2026-05-13T08:00:00Z', maHoSo: 'HS-2026-0408' },
  { maViPham: 'VP-003', tenCoSo: 'Công ty Hải Sản Đà Nẵng',      loaiViPham: 'Lỗi dây chuyền lạnh', mucDo: 'Nghiêm trọng', trangThai: 'Đang xử lý', thoiGianKiemTra: '2026-05-12T10:00:00Z', maHoSo: 'HS-2026-0401' },
  { maViPham: 'VP-004', tenCoSo: 'Chợ Tươi Đà Nẵng',             loaiViPham: 'Thiếu nhãn mác', mucDo: 'Nhẹ', trangThai: 'Đã xử lý', thoiGianKiemTra: '2026-05-11T11:00:00Z', maHoSo: 'HS-2026-0395' },
];

const MUC_DO_STYLE: Record<string, React.CSSProperties> = {
  'Nghiêm trọng': { background:'#FDECEA', color:'#CC0000', borderColor:'#F5BCBC' },
  'Trung bình':   { background:'#FFF4E5', color:'#CC6600', borderColor:'#FFCC80' },
  'Nhẹ':          { background:'#F0F0F0', color:'#555',    borderColor:'#CCC'    },
};

const TRANG_THAI_STYLE: Record<string, React.CSSProperties> = {
  'Chờ xử lý':  { background:'#FDECEA', color:'#CC0000', borderColor:'#F5BCBC' },
  'Đang xử lý': { background:'#FFF4E5', color:'#CC6600', borderColor:'#FFCC80' },
  'Đã xử lý':   { background:'#E6F4E6', color:'#006400', borderColor:'#94C994' },
};

function formatDateTime(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
}

function BadgeCell({ label, styleMap }: { label: string; styleMap: Record<string, React.CSSProperties> }) {
  const style = styleMap[label] ?? { background:'#F0F0F0', color:'#555', borderColor:'#CCC' };
  return (
    <span style={{ display:'inline-block', padding:'1px 7px', borderRadius:'2px', fontSize:'11px', fontWeight:500, border:'1px solid', ...style }}>
      {label}
    </span>
  );
}

export default function PendingRecords() {
  const [data, setData]       = useState<ViPhamGanDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    thongKeApi.getViPhamGanDay(10)
      .then(setData)
      .catch(() => setData(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const rows = loading ? FALLBACK : (data.length ? data : FALLBACK);

  return (
    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12.5px' }}>
      <thead>
        <tr>
          {['Mã vi phạm', 'Cơ sở', 'Loại vi phạm', 'Mức độ', 'Ngày kiểm tra', 'Trạng thái', 'Thao tác'].map(h => (
            <th key={h} style={{ background:'#E8E8E8', border:'1px solid #D6D6D6', padding:'5px 10px', fontSize:'11.5px', fontWeight:600, color:'#333', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.maViPham} style={{ backgroundColor: i % 2 === 1 ? '#FAFAFA' : '#FFF' }}>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontFamily:'monospace', fontSize:'11.5px', color:'#005A9E', fontWeight:600 }}>{r.maViPham}</td>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontWeight:500, color:'#222' }}>{r.tenCoSo}</td>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', color:'#444' }}>{r.loaiViPham}</td>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px' }}><BadgeCell label={r.mucDo} styleMap={MUC_DO_STYLE} /></td>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontFamily:'monospace', fontSize:'11.5px', color:'#555' }}>{formatDateTime(r.thoiGianKiemTra)}</td>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px' }}><BadgeCell label={r.trangThai} styleMap={TRANG_THAI_STYLE} /></td>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 8px' }}>
              <Link href={`/vi-pham/${r.maHoSo}`}>
                <button style={{ height:'22px', padding:'0 8px', borderRadius:'2px', background:'#008000', color:'#fff', border:'1px solid #006400', fontSize:'11px', fontWeight:500, cursor:'pointer' }}>
                  Xem
                </button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
