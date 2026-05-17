type AlertType = 'warning' | 'danger' | 'info' | 'success';

const alertConfig: Record<AlertType, { bg: string; border: string; leftBar: string; color: string; prefix: string }> = {
  warning: { bg: '#FFF4E5', border: '#FFCC80', leftBar: '#CC6600', color: '#7a3e00', prefix: '⚠ Cảnh báo' },
  danger:  { bg: '#FDECEA', border: '#F5BCBC', leftBar: '#CC0000', color: '#7a0000', prefix: '✖ Lỗi'      },
  info:    { bg: '#E3EFFA', border: '#9FC3E0', leftBar: '#005A9E', color: '#003d73', prefix: 'ℹ Thông báo' },
  success: { bg: '#E6F4E6', border: '#94C994', leftBar: '#008000', color: '#004d00', prefix: '✔ Thành công' },
};

interface AlertBannerProps {
  type?: AlertType;
  title: string;
  message?: string;
  className?: string;
}

export default function AlertBanner({ type = 'info', title, message }: AlertBannerProps) {
  const c = alertConfig[type];
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderLeft: `4px solid ${c.leftBar}`,
        borderRadius: '2px',
        padding: '8px 12px',
        marginBottom: '10px',
        fontSize: '12.5px',
        color: c.color,
      }}
    >
      <strong>{c.prefix}:</strong> {title}
      {message && (
        <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: c.color, opacity: 0.85 }}>
          {message}
        </p>
      )}
    </div>
  );
}
