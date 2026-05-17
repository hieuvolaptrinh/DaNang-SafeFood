import Badge from '@/components/Badge';

const records = [
  { id:'HS-2026-0412', name:'Lò Bánh Mì Thanh Khê', type:'Phê duyệt chứng nhận', status:'pending', date:'14/05/2026', priority:'high' },
  { id:'HS-2026-0408', name:'Grill House Đà Nẵng',   type:'Gia hạn giấy phép',    status:'pending', date:'13/05/2026', priority:'high' },
  { id:'HS-2026-0401', name:'Công ty TNHH Ocean Catch', type:'Bổ sung hồ sơ',     status:'in-progress', date:'12/05/2026', priority:'medium' },
  { id:'HS-2026-0395', name:'Mì Quảng Trâm',         type:'Phê duyệt chứng nhận', status:'pending', date:'11/05/2026', priority:'medium' },
];

export default function PendingRecords() {
  return (
    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12.5px' }}>
      <thead>
        <tr>
          {['Mã hồ sơ','Cơ sở','Loại hồ sơ','Ngày nộp','Ưu tiên','Trạng thái','Xử lý'].map(h => (
            <th key={h} style={{ background:'#E8E8E8', border:'1px solid #D6D6D6', padding:'5px 10px', fontSize:'11.5px', fontWeight:600, color:'#333', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.map((r, i) => (
          <tr key={r.id} style={{ backgroundColor: i%2===1 ? '#FAFAFA':'#FFF' }}>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontFamily:'monospace', fontSize:'11.5px', color:'#005A9E', fontWeight:600 }}>{r.id}</td>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontWeight:500, color:'#222' }}>{r.name}</td>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', color:'#444' }}>{r.type}</td>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontFamily:'monospace', fontSize:'11.5px', color:'#555' }}>{r.date}</td>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px' }}><Badge variant={r.priority} /></td>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px' }}><Badge variant={r.status} /></td>
            <td style={{ border:'1px solid #D6D6D6', padding:'4px 8px' }}>
              <button style={{ height:'22px', padding:'0 8px', borderRadius:'2px', background:'#008000', color:'#fff', border:'1px solid #006400', fontSize:'11px', fontWeight:500, cursor:'pointer' }}>Xử lý</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
