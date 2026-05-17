export default function UnderConstruction({ title = 'Trang đang phát triển' }: { title?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        background: '#fff',
        border: '1px solid #D6D6D6',
        borderRadius: '2px',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          background: '#EAF7EA',
          border: '2px solid #94C994',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
          fontSize: '22px',
        }}
      >
        🔧
      </div>
      <h3
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#333',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '6px',
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: '12.5px', color: '#666', maxWidth: '320px', lineHeight: 1.6 }}>
        Chức năng này đang trong quá trình phát triển và sẽ được cập nhật trong phiên bản tiếp theo.
      </p>
      <p style={{ fontSize: '11.5px', color: '#999', marginTop: '8px' }}>
        Liên hệ hỗ trợ: <strong>(0236) 3.819.879</strong>
      </p>
    </div>
  );
}
