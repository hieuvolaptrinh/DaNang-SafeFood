import Link from 'next/link';

const alerts = [
  { name:'Công ty Hải Sản Đà Nẵng', license:'FSL-2023-0234', expiry:'01/11/2024', days:-196, district:'Thanh Khê', status:'expired' },
  { name:'Lò Bánh Mì Thanh Khê',    license:'FSL-2023-0099', expiry:'28/02/2025', days:12,   district:'Thanh Khê', status:'expiring' },
  { name:'Bánh Mì Hội An',          license:'FSL-2024-0087', expiry:'15/03/2025', days:27,   district:'Sơn Trà',   status:'expiring' },
  { name:'Cà Phê Thu Hiền',         license:'FSL-2024-0198', expiry:'01/07/2025', days:46,   district:'Ngũ Hành Sơn', status:'expiring' },
];

export default function ExpiryAlerts() {
  return (
    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12.5px' }}>
      <thead>
        <tr>
          {['Cơ sở','Số giấy phép','Quận/Huyện','Ngày hết hạn','Tình trạng','Thao tác'].map(h => (
            <th key={h} style={{ background:'#E8E8E8', border:'1px solid #D6D6D6', padding:'5px 10px', fontSize:'11.5px', fontWeight:600, color:'#333', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {alerts.map((a, i) => {
          const isExpired = a.days < 0;
          return (
            <tr key={i} style={{ backgroundColor: i%2===1 ? '#FAFAFA':'#FFF' }}>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontWeight:600, color:'#222' }}>{a.name}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontFamily:'monospace', fontSize:'11.5px', color:'#555' }}>{a.license}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', color:'#444' }}>{a.district}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px', fontFamily:'monospace', fontSize:'11.5px', color: isExpired ? '#CC0000' : '#CC6600', fontWeight:600 }}>{a.expiry}</td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 10px' }}>
                <span style={{
                  display:'inline-block', padding:'1px 7px', borderRadius:'2px', fontSize:'11px', fontWeight:600, border:'1px solid',
                  ...(isExpired
                    ? { background:'#FDECEA', color:'#CC0000', borderColor:'#F5BCBC' }
                    : { background:'#FFF4E5', color:'#CC6600', borderColor:'#FFCC80' }),
                }}>
                  {isExpired ? `Quá hạn ${Math.abs(a.days)} ngày` : `Còn ${a.days} ngày`}
                </span>
              </td>
              <td style={{ border:'1px solid #D6D6D6', padding:'4px 8px' }}>
                <button style={{ height:'22px', padding:'0 8px', borderRadius:'2px', background:'#CC6600', color:'#fff', border:'1px solid #aa5500', fontSize:'11px', fontWeight:500, cursor:'pointer' }}>Nhắc nhở</button>
              </td>
            </tr>
          );
        })}
        <tr style={{ background:'#EAF7EA' }}>
          <td colSpan={6} style={{ border:'1px solid #D6D6D6', padding:'6px 12px' }}>
            <Link href="/co-so-kinh-doanh/giay-phep" style={{ fontSize:'12px', color:'#008000', fontWeight:600 }}>
              → Xem tất cả giấy phép sắp hết hạn (80 cơ sở)
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
