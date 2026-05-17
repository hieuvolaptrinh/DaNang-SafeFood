import { PageHeader, SectionCard, StatusBadge, MiniStat } from '@/components/GovUI';
import { RefreshCw } from 'lucide-react';

export default function MayСhuPage() {
  const metrics = [
    { label: 'CPU Load',       value: '34%', pct: 34, note: '8 lõi / Intel Xeon E5',        color: 'green'  as const },
    { label: 'Bộ nhớ RAM',     value: '72%', pct: 72, note: '28,8 GB / 40 GB đang sử dụng', color: 'orange' as const },
    { label: 'Lưu lượng mạng', value: '1,2 GB/s', pct: 28, note: 'Băng thông: 5 GB/s',     color: 'blue'   as const },
  ];

  const serverInfo = [
    { key: 'Hostname',                val: 'fsms-prod-01.danang.gov.vn' },
    { key: 'Hệ điều hành',            val: 'Ubuntu 22.04 LTS' },
    { key: 'Node.js',                 val: 'v20.11.0' },
    { key: 'Cơ sở dữ liệu',          val: 'PostgreSQL 15.4' },
    { key: 'Uptime',                  val: '14 ngày 6 giờ', highlight: true },
    { key: 'Khởi động lại lần cuối', val: '01/01/2025 00:00' },
  ];

  const services = [
    { name: 'API Gateway',    status: 'active',  label: 'Đang chạy' },
    { name: 'Auth Service',   status: 'active',  label: 'Đang chạy' },
    { name: 'Cơ sở dữ liệu', status: 'active',  label: 'Đang chạy' },
    { name: 'File Storage',   status: 'active',  label: 'Đang chạy' },
    { name: 'Email Service',  status: 'pending', label: 'Suy giảm'  },
    { name: 'Bộ lập lịch',   status: 'active',  label: 'Đang chạy' },
  ];

  const barColors: Record<string, string> = {
    green: '#008000',
    orange: '#CC6600',
    blue: '#005A9E',
  };

  return (
    <div>
      <PageHeader
        title="Giám sát máy chủ"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Tổng quan sức khỏe cơ sở hạ tầng theo thời gian thực"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#006400', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#008000', display: 'inline-block' }} />
              Tất cả hệ thống hoạt động bình thường
            </span>
            <button
              type="button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                height: '30px', padding: '0 12px', borderRadius: '2px',
                border: '1px solid #D6D6D6', background: '#fff', color: '#333',
                fontSize: '12.5px', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <RefreshCw style={{ width: 12, height: 12 }} /> Làm mới
            </button>
          </div>
        }
      />

      {/* Server metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '12px' }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: '#fff',
              border: '1px solid #D6D6D6',
              borderTop: `3px solid ${barColors[m.color]}`,
              borderRadius: '1px',
              padding: '10px 14px',
            }}
          >
            <p style={{ fontSize: '10.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '4px' }}>{m.label}</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#222', margin: '0 0 6px 0', fontVariantNumeric: 'tabular-nums' }}>{m.value}</p>
            <div style={{ height: 4, background: '#E8E8E8', borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' }}>
              <div style={{ width: `${m.pct}%`, height: '100%', background: barColors[m.color] }} />
            </div>
            <p style={{ fontSize: '11px', color: '#777' }}>{m.note}</p>
          </div>
        ))}
      </div>

      {/* Server info + Services */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        {/* Server info */}
        <SectionCard title="Thông tin máy chủ">
          <div>
            {serverInfo.map((row) => (
              <div
                key={row.key}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 12px',
                  borderBottom: '1px solid #F0F0F0',
                }}
              >
                <span style={{ fontSize: '12.5px', color: '#555' }}>{row.key}</span>
                <span style={{
                  fontSize: '12.5px', fontWeight: 600,
                  fontFamily: 'monospace',
                  color: row.highlight ? '#006400' : '#222',
                }}>
                  {row.val}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Services */}
        <SectionCard title="Trạng thái dịch vụ">
          <div>
            {services.map((svc) => (
              <div
                key={svc.name}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 12px',
                  borderBottom: '1px solid #F0F0F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: svc.status === 'active' ? '#008000' : '#CC6600',
                  }} />
                  <span style={{ fontSize: '12.5px', color: '#333' }}>{svc.name}</span>
                </div>
                <StatusBadge
                  variant={svc.status === 'active' ? 'active' : 'pending'}
                  label={svc.label}
                />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Disk usage */}
      <SectionCard title="Phân bổ lưu trữ (2 TB SSD)">
        <div style={{ padding: '10px 12px' }}>
          <div style={{ display: 'flex', height: '12px', borderRadius: '1px', overflow: 'hidden', gap: '2px', marginBottom: '10px' }}>
            {[
              { label: 'Cơ sở dữ liệu', pct: 9,  color: '#005A9E' },
              { label: 'Nhật ký',       pct: 2,  color: '#008000' },
              { label: 'Tệp tải lên',   pct: 4,  color: '#CC6600' },
              { label: 'Trống',         pct: 85, color: '#E8E8E8' },
            ].map((seg) => (
              <div key={seg.label} style={{ width: `${seg.pct}%`, height: '100%', background: seg.color }} title={`${seg.label}: ${seg.pct}%`} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'Cơ sở dữ liệu', color: '#005A9E', val: '180 GB' },
              { label: 'Nhật ký',       color: '#008000', val: '40 GB'  },
              { label: 'Tệp tải lên',   color: '#CC6600', val: '80 GB'  },
              { label: 'Trống',         color: '#CCC',    val: '1.700 GB' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#555' }}>
                <span style={{ width: 10, height: 10, borderRadius: '1px', background: item.color, flexShrink: 0 }} />
                {item.label} <strong style={{ color: '#333' }}>({item.val})</strong>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
