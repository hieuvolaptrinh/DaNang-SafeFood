export default function MayСhuPage() {
  const metrics = [
    { label: 'CPU Load',       value: '34%', pct: 34, note: '8 lõi / Intel Xeon E5',        color: 'bg-emerald-500', textColor: 'text-emerald-600', status: 'ok' },
    { label: 'Bộ nhớ RAM',     value: '72%', pct: 72, note: '28,8 GB / 40 GB đang sử dụng', color: 'bg-amber-500',   textColor: 'text-amber-600',   status: 'warn' },
    { label: 'Lưu lượng mạng', value: '1,2 GB/s', pct: 28, note: 'Băng thông: 5 GB/s',      color: 'bg-blue-500',    textColor: 'text-blue-600',    status: 'ok' },
  ];

  const serverInfo = [
    { key: 'Hostname',         val: 'fsms-prod-01.danang.gov.vn' },
    { key: 'Hệ điều hành',     val: 'Ubuntu 22.04 LTS' },
    { key: 'Node.js',          val: 'v20.11.0' },
    { key: 'Cơ sở dữ liệu',   val: 'PostgreSQL 15.4' },
    { key: 'Uptime',           val: '14 ngày 6 giờ', highlight: true },
    { key: 'Khởi động lại lần cuối', val: '01/01/2025 00:00' },
  ];

  const services = [
    { name: 'API Gateway',     status: 'active',  label: 'Đang chạy' },
    { name: 'Auth Service',    status: 'active',  label: 'Đang chạy' },
    { name: 'Cơ sở dữ liệu',  status: 'active',  label: 'Đang chạy' },
    { name: 'File Storage',    status: 'active',  label: 'Đang chạy' },
    { name: 'Email Service',   status: 'pending', label: 'Suy giảm' },
    { name: 'Bộ lập lịch',    status: 'active',  label: 'Đang chạy' },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Giám sát Máy chủ</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Tổng quan sức khỏe cơ sở hạ tầng theo thời gian thực</p>
        </div>
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Tất cả hệ thống hoạt động bình thường
        </span>
      </div>

      {/* Server metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">{m.label}</p>
            <p className={`text-3xl font-extrabold font-display mb-2 ${m.textColor}`}>{m.value}</p>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div className={`h-full rounded-full transition-all ${m.color}`} style={{ width: `${m.pct}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">{m.note}</p>
          </div>
        ))}
      </div>

      {/* Server info + Services */}
      <div className="grid grid-cols-2 gap-4">
        {/* Server info */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <span className="text-sm font-bold text-slate-800">Thông tin máy chủ</span>
          </div>
          <div className="p-2">
            {serverInfo.map((row) => (
              <div key={row.key} className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 last:border-0">
                <span className="text-[13px] text-slate-500">{row.key}</span>
                <span className={`text-[13px] font-semibold font-mono ${row.highlight ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {row.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <span className="text-sm font-bold text-slate-800">Trạng thái dịch vụ</span>
          </div>
          <div className="p-2">
            {services.map((svc) => {
              const dotColor = svc.status === 'active' ? 'bg-emerald-500' : svc.status === 'pending' ? 'bg-amber-500' : 'bg-red-500';
              const textColor = svc.status === 'active' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200';
              return (
                <div key={svc.name} className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
                    <span className="text-[13px] text-slate-700">{svc.name}</span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${textColor}`}>
                    {svc.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Disk usage */}
      <div className="mt-4 bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <p className="text-sm font-bold text-slate-800 mb-4">Phân bổ Lưu trữ (2 TB SSD)</p>
        <div className="flex h-6 rounded-full overflow-hidden gap-0.5">
          {[
            { label: 'Cơ sở dữ liệu', pct: 9,  color: 'bg-blue-500' },
            { label: 'Nhật ký',       pct: 2,  color: 'bg-emerald-500' },
            { label: 'Tệp tải lên',   pct: 4,  color: 'bg-amber-500' },
            { label: 'Trống',         pct: 85, color: 'bg-slate-100' },
          ].map((seg) => (
            <div key={seg.label} className={`${seg.color} transition-all`} style={{ width: `${seg.pct}%` }} title={`${seg.label}: ${seg.pct}%`} />
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          {[
            { label: 'Cơ sở dữ liệu', color: 'bg-blue-500',    val: '180 GB' },
            { label: 'Nhật ký',       color: 'bg-emerald-500', val: '40 GB' },
            { label: 'Tệp tải lên',   color: 'bg-amber-500',   val: '80 GB' },
            { label: 'Trống',         color: 'bg-slate-200',   val: '1.700 GB' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-[12px] text-slate-500">
              <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
              {item.label} <span className="font-semibold text-slate-700">({item.val})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
