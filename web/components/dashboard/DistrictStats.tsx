'use client';

import { useEffect, useState } from 'react';
import { thongKeApi, ThongKeQuanHuyen } from '@/api/api';

// Fallback data khi API chưa sẵn sàng
const FALLBACK: ThongKeQuanHuyen[] = [
  { maQuanHuyen: 'HC', tenQuanHuyen: 'Hải Châu',     tongCoSo: 412, datChuan: 358, viPham: 12, tyLeDat: 86.9, mucDo: 'Tốt' },
  { maQuanHuyen: 'TK', tenQuanHuyen: 'Thanh Khê',    tongCoSo: 298, datChuan: 251, viPham: 8,  tyLeDat: 84.2, mucDo: 'Tốt' },
  { maQuanHuyen: 'ST', tenQuanHuyen: 'Sơn Trà',      tongCoSo: 356, datChuan: 310, viPham: 9,  tyLeDat: 87.1, mucDo: 'Tốt' },
  { maQuanHuyen: 'NHS',tenQuanHuyen: 'Ngũ Hành Sơn', tongCoSo: 274, datChuan: 238, viPham: 6,  tyLeDat: 86.9, mucDo: 'Tốt' },
  { maQuanHuyen: 'LC', tenQuanHuyen: 'Liên Chiểu',   tongCoSo: 198, datChuan: 172, viPham: 7,  tyLeDat: 86.9, mucDo: 'Tốt' },
  { maQuanHuyen: 'CL', tenQuanHuyen: 'Cẩm Lệ',       tongCoSo: 186, datChuan: 159, viPham: 4,  tyLeDat: 85.5, mucDo: 'Tốt' },
  { maQuanHuyen: 'HV', tenQuanHuyen: 'Hòa Vang',     tongCoSo: 118, datChuan: 72,  viPham: 1,  tyLeDat: 61.0, mucDo: 'Thấp'},
];

export default function DistrictStats() {
  const [data, setData]     = useState<ThongKeQuanHuyen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    thongKeApi.getThongKeQuanHuyen()
      .then(setData)
      .catch(() => setData(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const rows = loading ? FALLBACK : (data.length ? data : FALLBACK);
  const totalCoSo    = rows.reduce((s, d) => s + d.tongCoSo, 0);
  const totalDatChuan = rows.reduce((s, d) => s + d.datChuan, 0);
  const totalViPham  = rows.reduce((s, d) => s + d.viPham, 0);

  return (
    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12.5px' }}>
      <thead>
        <tr>
          {['STT', 'Quận/Huyện', 'Tổng cơ sở', 'Đạt chuẩn', 'Vi phạm', 'Tỷ lệ đạt', 'Mức độ'].map(h => (
            <th key={h} style={{ background:'#E8E8E8', border:'1px solid #D6D6D6', padding:'5px 10px', fontSize:'12px', fontWeight:600, color:'#333', textAlign: h==='STT' ? 'center' : 'left', whiteSpace:'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((d, i) => {
          const rate = d.tyLeDat > 0 ? d.tyLeDat : (d.tongCoSo > 0 ? Math.round((d.datChuan / d.tongCoSo) * 100) : 0);
          const isGood = rate >= 85;
          const isMid  = rate >= 70 && rate < 85;
          return (
            <tr key={d.maQuanHuyen} style={{ backgroundColor: i % 2 === 1 ? '#FAFAFA' : '#FFF' }}>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 8px', textAlign:'center', fontSize:'12px', color:'#666' }}>{i + 1}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontWeight:600, color:'#222' }}>{d.tenQuanHuyen}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', textAlign:'right', fontFamily:'monospace' }}>{d.tongCoSo.toLocaleString('vi-VN')}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', textAlign:'right', fontFamily:'monospace', color:'#006400', fontWeight:600 }}>{d.datChuan.toLocaleString('vi-VN')}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', textAlign:'right', fontFamily:'monospace', color: d.viPham > 8 ? '#CC0000' : '#CC6600', fontWeight:600 }}>{d.viPham}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                  <div style={{ flex:1, height:'6px', background:'#E8E8E8', borderRadius:'2px', overflow:'hidden' }}>
                    <div style={{ width:`${Math.min(rate,100)}%`, height:'100%', background: isGood ? '#008000' : isMid ? '#CC6600' : '#CC0000' }} />
                  </div>
                  <span style={{ fontSize:'11.5px', fontWeight:600, color: isGood ? '#006400' : isMid ? '#CC6600' : '#CC0000', minWidth:'40px', textAlign:'right' }}>{rate.toFixed(1)}%</span>
                </div>
              </td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px' }}>
                <span style={{
                  display:'inline-block', padding:'1px 7px', borderRadius:'2px', fontSize:'11px', fontWeight:500, border:'1px solid',
                  ...(isGood ? { background:'#E6F4E6', color:'#006400', borderColor:'#94C994' }
                    : isMid  ? { background:'#FFF4E5', color:'#CC6600', borderColor:'#FFCC80' }
                              : { background:'#FDECEA', color:'#CC0000', borderColor:'#F5BCBC' }),
                }}>
                  {d.mucDo || (isGood ? 'Tốt' : isMid ? 'Trung bình' : 'Thấp')}
                </span>
              </td>
            </tr>
          );
        })}
        {/* Total row */}
        <tr style={{ background:'#EAF7EA', fontWeight:700 }}>
          <td colSpan={2} style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontWeight:700, color:'#006400' }}>TỔNG CỘNG</td>
          <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', textAlign:'right', fontFamily:'monospace' }}>{totalCoSo.toLocaleString('vi-VN')}</td>
          <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', textAlign:'right', fontFamily:'monospace', color:'#006400' }}>{totalDatChuan.toLocaleString('vi-VN')}</td>
          <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', textAlign:'right', fontFamily:'monospace', color:'#CC0000' }}>{totalViPham}</td>
          <td colSpan={2} style={{ border:'1px solid #D6D6D6', padding:'4px 10px', color:'#006400', fontWeight:700 }}>
            {totalCoSo > 0 ? `${Math.round(totalDatChuan / totalCoSo * 100)}% bình quân` : '—'}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
