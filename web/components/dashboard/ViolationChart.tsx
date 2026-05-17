const months = [
  { month:'T10/2025', count:5 },
  { month:'T11/2025', count:8 },
  { month:'T12/2025', count:6 },
  { month:'T1/2026',  count:9 },
  { month:'T2/2026',  count:4 },
  { month:'T3/2026',  count:7 },
  { month:'T4/2026',  count:11 },
  { month:'T5/2026',  count:3 },
];
const max = Math.max(...months.map(m => m.count));

export default function ViolationChart() {
  return (
    <div style={{ padding:'12px' }}>
      {/* Simple bar chart using divs */}
      <div style={{ display:'flex', alignItems:'flex-end', gap:'8px', height:'120px', marginBottom:'8px', borderBottom:'1px solid #D6D6D6', padding:'0 4px 4px 4px' }}>
        {months.map(m => {
          const pct = (m.count / max) * 100;
          const color = m.count >= 10 ? '#CC0000' : m.count >= 7 ? '#CC6600' : '#008000';
          return (
            <div key={m.month} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
              <span style={{ fontSize:'10px', fontWeight:600, color }}>{m.count}</span>
              <div style={{ width:'100%', background:'#E8E8E8', borderRadius:'1px', height:'100px', display:'flex', alignItems:'flex-end', overflow:'hidden' }}>
                <div style={{ width:'100%', height:`${pct}%`, background:color, transition:'height 0.3s' }} />
              </div>
            </div>
          );
        })}
      </div>
      {/* X-axis labels */}
      <div style={{ display:'flex', gap:'8px' }}>
        {months.map(m => (
          <div key={m.month} style={{ flex:1, textAlign:'center', fontSize:'10px', color:'#666', whiteSpace:'nowrap', overflow:'hidden' }}>{m.month}</div>
        ))}
      </div>
      {/* Summary */}
      <div style={{ marginTop:'10px', padding:'8px 10px', background:'#F5F5F5', border:'1px solid #D6D6D6', borderRadius:'1px', display:'flex', gap:'16px', fontSize:'12px', color:'#555' }}>
        <span>Tổng: <strong style={{ color:'#222' }}>{months.reduce((s,m)=>s+m.count,0)} vụ</strong></span>
        <span>Bình quân: <strong style={{ color:'#222' }}>{(months.reduce((s,m)=>s+m.count,0)/months.length).toFixed(1)} vụ/tháng</strong></span>
        <span>Cao nhất: <strong style={{ color:'#CC0000' }}>{max} vụ (T4/2026)</strong></span>
      </div>
    </div>
  );
}
