const data = [
  { district: 'Hải Châu',     total: 412, compliant: 358, violations: 12 },
  { district: 'Thanh Khê',    total: 298, compliant: 251, violations: 8  },
  { district: 'Sơn Trà',      total: 356, compliant: 310, violations: 9  },
  { district: 'Ngũ Hành Sơn', total: 274, compliant: 238, violations: 6  },
  { district: 'Liên Chiểu',   total: 198, compliant: 172, violations: 7  },
  { district: 'Cẩm Lệ',       total: 186, compliant: 159, violations: 4  },
  { district: 'Hòa Vang',     total: 118, compliant: 72,  violations: 1  },
];

export default function DistrictStats() {
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
        {data.map((d, i) => {
          const rate = Math.round((d.compliant / d.total) * 100);
          const isGood = rate >= 85;
          const isMid  = rate >= 70 && rate < 85;
          return (
            <tr key={d.district} style={{ backgroundColor: i % 2 === 1 ? '#FAFAFA' : '#FFF' }}>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 8px', textAlign:'center', fontSize:'12px', color:'#666' }}>{i + 1}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontWeight:600, color:'#222' }}>{d.district}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', textAlign:'right', fontFamily:'monospace' }}>{d.total.toLocaleString('vi-VN')}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', textAlign:'right', fontFamily:'monospace', color:'#006400', fontWeight:600 }}>{d.compliant.toLocaleString('vi-VN')}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', textAlign:'right', fontFamily:'monospace', color: d.violations > 8 ? '#CC0000' : '#CC6600', fontWeight:600 }}>{d.violations}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                  <div style={{ flex:1, height:'6px', background:'#E8E8E8', borderRadius:'2px', overflow:'hidden' }}>
                    <div style={{ width:`${rate}%`, height:'100%', background: isGood ? '#008000' : isMid ? '#CC6600' : '#CC0000' }} />
                  </div>
                  <span style={{ fontSize:'11.5px', fontWeight:600, color: isGood ? '#006400' : isMid ? '#CC6600' : '#CC0000', minWidth:'36px', textAlign:'right' }}>{rate}%</span>
                </div>
              </td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px' }}>
                <span style={{
                  display:'inline-block', padding:'1px 7px', borderRadius:'2px', fontSize:'11px', fontWeight:500, border:'1px solid',
                  ...(isGood ? { background:'#E6F4E6', color:'#006400', borderColor:'#94C994' }
                    : isMid  ? { background:'#FFF4E5', color:'#CC6600', borderColor:'#FFCC80' }
                              : { background:'#FDECEA', color:'#CC0000', borderColor:'#F5BCBC' }),
                }}>
                  {isGood ? 'Tốt' : isMid ? 'Trung bình' : 'Thấp'}
                </span>
              </td>
            </tr>
          );
        })}
        {/* Total row */}
        <tr style={{ background:'#EAF7EA', fontWeight:700 }}>
          <td colSpan={2} style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontWeight:700, color:'#006400' }}>TỔNG CỘNG</td>
          <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', textAlign:'right', fontFamily:'monospace' }}>{data.reduce((s,d)=>s+d.total,0).toLocaleString('vi-VN')}</td>
          <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', textAlign:'right', fontFamily:'monospace', color:'#006400' }}>{data.reduce((s,d)=>s+d.compliant,0).toLocaleString('vi-VN')}</td>
          <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', textAlign:'right', fontFamily:'monospace', color:'#CC0000' }}>{data.reduce((s,d)=>s+d.violations,0)}</td>
          <td colSpan={2} style={{ border:'1px solid #D6D6D6', padding:'4px 10px', color:'#006400', fontWeight:700 }}>
            {Math.round(data.reduce((s,d)=>s+d.compliant,0)/data.reduce((s,d)=>s+d.total,0)*100)}% bình quân
          </td>
        </tr>
      </tbody>
    </table>
  );
}
