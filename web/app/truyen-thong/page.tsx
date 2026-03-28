export default function TruyenThongPage() {
  const items = [
    { icon: '📋', title: 'Quy định pháp luật', desc: 'Thư viện văn bản quy phạm pháp luật về an toàn thực phẩm', href: '/truyen-thong/quy-dinh', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
    { icon: '📢', title: 'Thông báo',           desc: 'Thông báo công khai đến các cơ sở kinh doanh thực phẩm',     href: '/truyen-thong/thong-bao', color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
    { icon: '⚠️', title: 'Cảnh báo ATTP',      desc: 'Cảnh báo khẩn cấp về nguy cơ an toàn thực phẩm',            href: '/truyen-thong/canh-bao',  color: 'bg-amber-50 border-amber-200 hover:bg-amber-100' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Truyền thông</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">Quản lý thông tin và truyền thông về an toàn thực phẩm</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`block p-6 rounded-xl border transition-colors cursor-pointer ${item.color}`}
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h2 className="text-[15px] font-bold text-slate-800 mb-1">{item.title}</h2>
            <p className="text-[13px] text-slate-500">{item.desc}</p>
          </a>
        ))}
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200">
          <span className="text-sm font-bold text-slate-800">Hoạt động gần đây</span>
        </div>
        {[
          { action: 'Đăng thông báo mới:', target: 'Yêu cầu kiểm tra định kỳ Q1/2025', time: '14/01/2025 08:00', icon: '📢' },
          { action: 'Cập nhật quy định:', target: 'Nghị định 15/2018/NĐ-CP sửa đổi', time: '10/01/2025 14:30', icon: '📋' },
          { action: 'Cảnh báo phát đi:', target: 'Nguy cơ ngộ độc từ hải sản khu vực Sơn Trà', time: '08/01/2025 09:15', icon: '⚠️' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3.5 border-b border-slate-100 last:border-0">
            <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
            <div>
              <p className="text-[13px] text-slate-700">
                {item.action} <strong>{item.target}</strong>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
