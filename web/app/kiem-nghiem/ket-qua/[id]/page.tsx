'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, FlaskConical, CheckCircle2, XCircle,
  FileText, Shield, Building, Calendar, Beaker,
  AlertTriangle, Check, Info, Landmark, Scale
} from 'lucide-react';
import {
  PageHeader, GovBtn, SectionCard, ActionButtons,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';
import { ketQuaKiemNghiemApi, KetQuaKiemNghiemDetailResponse } from '@/api/ketquakiemnghiem';
import { viPhamApi, DanhMucLoaiViPhamItem } from '@/api';
import { useAuth } from '@/lib/AuthContext';

const defaultLoaiViPham = [
  { maLoaiViPham: 'LVP001', tenLoaiViPham: 'Vi phạm vệ sinh cơ sở' },
  { maLoaiViPham: 'LVP002', tenLoaiViPham: 'Vi phạm về nguồn gốc thực phẩm' },
  { maLoaiViPham: 'LVP003', tenLoaiViPham: 'Vi phạm thực phẩm' },
  { maLoaiViPham: 'LVP004', tenLoaiViPham: 'Vi phạm về nhân sự' },
  { maLoaiViPham: 'LVP005', tenLoaiViPham: 'Vi phạm về giấy tờ pháp lý' },
  { maLoaiViPham: 'LVP006', tenLoaiViPham: 'Vi phạm hành chính' },
];

export default function KetQuaDetailPage() {
  const nextParams = useParams();
  const router = useRouter();
  const maKetQua = nextParams?.id as string;

  const { user } = useAuth();
  const isKiemDinh = user?.mappedRole === 'TESTER';

  const [detail, setDetail] = useState<KetQuaKiemNghiemDetailResponse | null>(null);
  const [danhMucLoaiViPham, setDanhMucLoaiViPham] = useState<DanhMucLoaiViPhamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Violation form states
  const [maLoaiViPham, setMaLoaiViPham] = useState('');
  const [soTienPhat, setSoTienPhat] = useState<number>(5000000);
  const [moTaThem, setMoTaThem] = useState('');
  const [khacPhuc, setKhacPhuc] = useState('');
  const [mucDo, setMucDo] = useState('Trung bình');
  const [submittingVio, setSubmittingVio] = useState(false);
  const [vioCreated, setVioCreated] = useState<any>(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!maKetQua) return;
    const fetchDetailAndCatalog = async () => {
      setLoading(true);
      setError('');
      try {
        const [data, lvpList] = await Promise.all([
          ketQuaKiemNghiemApi.getById(maKetQua),
          viPhamApi.getDanhMucLoaiViPham().catch(() => [])
        ]);
        
        setDetail(data);
        
        const catalog = (lvpList && lvpList.length > 0) ? lvpList : defaultLoaiViPham;
        setDanhMucLoaiViPham(catalog);
        if (catalog.length > 0) {
          setMaLoaiViPham(catalog[0].maLoaiViPham);
        }
      } catch (err: any) {
        setError(err.message || 'Không thể tải chi tiết kết quả kiểm nghiệm.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetailAndCatalog();
  }, [maKetQua]);

  const handleCreateViolation = async () => {
    if (!detail) return;
    setSubmittingVio(true);
    setFormError('');
    try {
      const res = await viPhamApi.create({
        maMau: detail.maMau,
        maLoaiViPham,
        soTienPhat,
        moTaThem: moTaThem || `Mẫu không đạt chất lượng kiểm nghiệm. ${detail.lyDoKhongDat || ''}`,
        khacPhuc: khacPhuc || 'Tiêu hủy lô sản phẩm và vệ sinh khu vực bảo quản.',
        mucDo
      });
      setVioCreated(res);
    } catch (err: any) {
      setFormError(err.message || 'Không thể lập biên bản vi phạm.');
    } finally {
      setSubmittingVio(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#005A9E', fontSize: '14px', fontWeight: 500 }}>
        <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid rgba(0,90,158,0.2)', borderTopColor: '#005A9E', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '8px' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <div>Đang tải thông tin kết quả kiểm nghiệm...</div>
      </div>
    );
  }

  if (error && !detail) {
    return (
      <div style={{ padding: '16px' }}>
        <PageHeader
          title="Lỗi tải kết quả kiểm nghiệm"
          subtitle="Không tìm thấy thông tin hoặc đã xảy ra lỗi."
          actions={
            <Link href="/kiem-nghiem/ket-qua">
              <GovBtn variant="secondary">
                <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
              </GovBtn>
            </Link>
          }
        />
        <AlertBanner type="danger" title={error} />
      </div>
    );
  }

  const isDat = detail && (detail.ketQua === 'pass' || detail.ketQua === 'Đạt' || detail.ketQua === 'DAT');

  return (
    <div style={{ paddingBottom: '40px' }}>
      <PageHeader
        title={`Chi tiết kết quả kiểm nghiệm — ${maKetQua}`}
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Kết quả phân tích mẫu thực phẩm tại phòng LAB"
        actions={
          <ActionButtons>
            <Link href="/kiem-nghiem/ket-qua">
              <GovBtn variant="secondary">
                <ArrowLeft style={{ width: 12, height: 12, marginRight: 4 }} /> Quay lại
              </GovBtn>
            </Link>
          </ActionButtons>
        }
      />

      {detail && !isDat && (
        <div style={{ marginBottom: '16px' }}>
          <AlertBanner
            type="danger"
            title={`Kết quả kiểm nghiệm KHÔNG ĐẠT tiêu chuẩn an toàn thực phẩm. Lý do: ${detail.lyDoKhongDat || 'Có chỉ tiêu kiểm nghiệm vượt ngưỡng quy định.'}`}
          />
        </div>
      )}

      {detail && isDat && (
        <div style={{ marginBottom: '16px' }}>
          <AlertBanner
            type="success"
            title={`Mẫu kiểm nghiệm ĐẠT chuẩn chất lượng an toàn vệ sinh thực phẩm theo quy chuẩn.`}
          />
        </div>
      )}

      {/* Modern Dashboard Stats Grid */}
      {detail && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Mã kết quả', value: detail.maKetQua, mono: true, color: '#005A9E', desc: 'Mã số tra cứu hệ thống' },
            { label: 'Mã mẫu kiểm định', value: detail.maMau, mono: true, color: '#666', desc: 'Mẫu thu thập hiện trường' },
            { label: 'Tên mẫu thực phẩm', value: detail.tenMau, mono: false, color: '#333', desc: detail.loaiMau },
            {
              label: 'Trạng thái đánh giá',
              value: isDat ? 'ĐẠT CHUẨN' : 'KHÔNG ĐẠT',
              mono: false,
              color: isDat ? '#15803d' : '#b91c1c',
              desc: 'Đánh giá kỹ thuật phòng LAB',
              isBadge: true
            },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderTop: `4px solid ${c.color}`,
                padding: '14px 18px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '85px'
              }}
            >
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#718096', marginBottom: '4px' }}>{c.label}</p>
                {c.isBadge ? (
                  <div style={{ fontSize: '15px', fontWeight: 800, color: c.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {isDat ? <CheckCircle2 style={{ width: 16, height: 16 }} /> : <XCircle style={{ width: 16, height: 16 }} />}
                    {c.value}
                  </div>
                ) : (
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A202C', fontFamily: c.mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{c.value}</div>
                )}
              </div>
              <p style={{ fontSize: '11px', color: '#A0AEC0', marginTop: '6px', fontStyle: 'italic' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      )}

      {detail && (
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr', gap: '20px', marginBottom: '20px' }}>
          
          {/* Main Info Card */}
          <SectionCard title="Thông tin chi tiết mẫu & Kiểm nghiệm">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px 24px',
              padding: '8px 0',
            }}>
              <InfoRow label="Cơ sở sản xuất / kinh doanh">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#1A202C' }}>
                  <Building style={{ width: 15, height: 15, color: '#4A5568' }} />
                  {detail.tenCoSo}
                </span>
              </InfoRow>
              <InfoRow label="Phòng thí nghiệm thực hiện">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#2B6CB0', fontWeight: 500 }}>
                  <Beaker style={{ width: 15, height: 15, color: '#2B6CB0' }} />
                  {detail.phongLab || 'Phòng LAB Chi cục ATVSTP'}
                </span>
              </InfoRow>
              <InfoRow label="Loại mẫu">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <FlaskConical style={{ width: 15, height: 15, color: '#4A5568' }} />
                  {detail.loaiMau}
                </span>
              </InfoRow>
              <InfoRow label="Ngày hoàn thành kiểm nghiệm">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', color: '#2D3748' }}>
                  <Calendar style={{ width: 15, height: 15, color: '#4A5568' }} />
                  {detail.ngayKiemNghiem || '—'}
                </span>
              </InfoRow>
              <InfoRow label="Quy chuẩn/Tiêu chuẩn đánh giá" value={detail.chiTieu || 'Quy chuẩn kỹ thuật quốc gia QCVN'} />
              <InfoRow label="Điểm số đánh giá tổng quát">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: (detail.diem || 0) >= 80 ? '#15803d' : (detail.diem || 0) >= 50 ? '#d97706' : '#b91c1c',
                    background: (detail.diem || 0) >= 80 ? '#f0fdf4' : (detail.diem || 0) >= 50 ? '#fef3c7' : '#fef2f2',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid currentColor'
                  }}>
                    {detail.diem !== null && detail.diem !== undefined ? `${detail.diem}/100` : 'Chưa chấm'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#718096' }}>Điểm càng cao độ an toàn càng lớn</span>
                </div>
              </InfoRow>
              
              {detail.fileKetQua && (
                <div style={{ gridColumn: '1 / -1', marginTop: '4px', borderTop: '1px dashed #E2E8F0', paddingTop: '12px' }}>
                  <InfoRow label="Tài liệu & Chứng thư kết quả">
                    <a
                      href={detail.fileKetQua}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        color: '#005A9E',
                        fontWeight: 600,
                        textDecoration: 'none',
                        fontSize: '13px',
                        background: '#F0F4F8',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: '1px solid #D2E0EE',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#E1E9F1';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#F0F4F8';
                      }}
                    >
                      <FileText style={{ width: 15, height: 15 }} /> Tải bản scan Phiếu kết quả gốc (PDF)
                    </a>
                  </InfoRow>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Right Column Action Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Conclusion Card */}
            <SectionCard title="Kết luận thanh tra">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isDat ? '#f0fdf4' : '#fef2f2',
                    color: isDat ? '#15803d' : '#b91c1c'
                  }}>
                    <Shield style={{ width: 20, height: 20 }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '13.5px', color: '#1A202C' }}>
                      {isDat ? 'Đủ điều kiện an toàn' : 'Không đủ điều kiện'}
                    </p>
                    <p style={{ fontSize: '11px', color: '#718096' }}>
                      {isDat ? 'Được phép lưu thông trên thị trường.' : 'Yêu cầu đình chỉ & phạt vi phạm.'}
                    </p>
                  </div>
                </div>
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#4A5568',
                  lineHeight: 1.5
                }}>
                  <p style={{ fontWeight: 700, color: '#2D3748', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Info style={{ width: 12, height: 12, color: '#4A5568' }} /> Hướng xử lý:
                  </p>
                  <p style={{ fontStyle: 'italic' }}>
                    {detail.ketQuaKiemNghiem || (isDat ? 'Đạt tiêu chuẩn an toàn thực phẩm. Lưu trữ hồ sơ theo dõi định kỳ.' : 'Không đạt chuẩn. Lập biên bản xử phạt hành chính, thu hồi lô hàng và tạm dừng dây chuyền liên quan.')}
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Violation Creation Form: ONLY FOR CB_KIEM_DINH (TESTER) & MẪU KHÔNG ĐẠT */}
            {isKiemDinh && !isDat && (
              <div style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'linear-gradient(to right, #742A2A, #9B2C2C)',
                  padding: '12px 16px',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Scale style={{ width: 16, height: 16 }} />
                  <span style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.02em' }}>LẬP BIÊN BẢN VI PHẠM</span>
                </div>
                
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {vioCreated ? (
                    <div style={{ padding: '12px 0', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: '#DEF7EC', color: '#03543F', marginBottom: 12 }}>
                        <Check style={{ width: 22, height: 22 }} />
                      </div>
                      <p style={{ fontWeight: 700, fontSize: '13.5px', color: '#03543F', marginBottom: '4px' }}>Lập biên bản thành công</p>
                      <p style={{ fontSize: '12px', color: '#4B5563', marginBottom: '16px' }}>Mã biên bản: <strong style={{ fontFamily: 'monospace', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px' }}>{vioCreated.maViPham}</strong></p>
                      <Link href="/vi-pham">
                        <GovBtn variant="primary" style={{ width: '100%', justifyContent: 'center' }}>Xem hồ sơ vi phạm</GovBtn>
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {formError && (
                        <AlertBanner type="danger" title={formError} />
                      )}

                      <div>
                        <label style={labelStyle}>Hành vi vi phạm chính <span style={{ color: 'red' }}>*</span></label>
                        <select value={maLoaiViPham} onChange={e => setMaLoaiViPham(e.target.value)} style={selectStyle}>
                          {danhMucLoaiViPham.map(lvp => (
                            <option key={lvp.maLoaiViPham} value={lvp.maLoaiViPham}>
                              {lvp.tenLoaiViPham} ({lvp.maLoaiViPham})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={labelStyle}>Mức độ nghiêm trọng</label>
                          <select value={mucDo} onChange={e => setMucDo(e.target.value)} style={selectStyle}>
                            <option value="Nhẹ">Nhẹ</option>
                            <option value="Trung bình">Trung bình</option>
                            <option value="Nghiêm trọng">Nghiêm trọng</option>
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Mức phạt dự kiến (VNĐ)</label>
                          <input 
                            type="number" 
                            value={soTienPhat} 
                            onChange={e => setSoTienPhat(Number(e.target.value))} 
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>Mô tả chi tiết vi phạm</label>
                        <textarea 
                          rows={3} 
                          value={moTaThem} 
                          onChange={e => setMoTaThem(e.target.value)} 
                          placeholder="Ví dụ: Chỉ tiêu Salmonella vượt 3 lần ngưỡng quy định, quy trình sơ chế không đảm bảo..."
                          style={textareaStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>Yêu cầu biện pháp khắc phục</label>
                        <textarea 
                          rows={2} 
                          value={khacPhuc} 
                          onChange={e => setKhacPhuc(e.target.value)} 
                          placeholder="Ví dụ: Tiêu hủy lô hàng thực phẩm, tổng vệ sinh cơ sở chế biến..."
                          style={textareaStyle}
                        />
                      </div>

                      <button 
                        onClick={handleCreateViolation} 
                        disabled={submittingVio}
                        style={{
                          marginTop: '6px',
                          width: '100%',
                          background: submittingVio ? '#718096' : '#C53030',
                          color: '#fff',
                          border: 'none',
                          padding: '10px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '12.5px',
                          cursor: submittingVio ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 4px rgba(197, 48, 48, 0.2)',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          if (!submittingVio) e.currentTarget.style.background = '#9B2C2C';
                        }}
                        onMouseOut={(e) => {
                          if (!submittingVio) e.currentTarget.style.background = '#C53030';
                        }}
                      >
                        <AlertTriangle style={{ width: 14, height: 14 }} /> 
                        {submittingVio ? 'Đang gửi...' : 'Ban hành biên bản vi phạm'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}

      {/* Chi tiet chi tieu table */}
      {detail && (
        <SectionCard title="Báo cáo phân tích chỉ tiêu chi tiết">
          <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F7FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  <th style={thStyle}>STT</th>
                  <th style={thStyle}>Mã chỉ tiêu</th>
                  <th style={thStyle}>Tên chỉ tiêu</th>
                  <th style={thStyle}>Giá trị đo được</th>
                  <th style={thStyle}>Giới hạn cho phép</th>
                  <th style={thStyle}>Đánh giá chất lượng</th>
                </tr>
              </thead>
              <tbody>
                {(!detail.chiTietChiTieu || detail.chiTietChiTieu.length === 0) ? (
                  <tr>
                    <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#A0AEC0', padding: '24px' }}>
                      Không có báo cáo chi tiết chỉ tiêu.
                    </td>
                  </tr>
                ) : (
                  detail.chiTietChiTieu.map((ct, idx) => {
                    const isCtDat = ct.ketLuan === 'pass' || ct.ketLuan === 'Đạt' || ct.ketLuan === 'DAT';
                    return (
                      <tr
                        key={ct.maChiTieu}
                        style={{
                          background: idx % 2 === 0 ? '#fff' : '#F7FAFC',
                          borderBottom: '1px solid #E2E8F0',
                          transition: 'background-color 0.15s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#EDF2F7';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#fff' : '#F7FAFC';
                        }}
                      >
                        <td style={{ ...tdStyle, textAlign: 'center', color: '#718096', fontWeight: 500 }}>{idx + 1}</td>
                        <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 600, color: '#2B6CB0' }}>{ct.maChiTieu}</td>
                        <td style={{ ...tdStyle, fontWeight: 500 }}>{ct.tenChiTieu}</td>
                        <td style={{ ...tdStyle, fontWeight: 600, color: isCtDat ? '#2D3748' : '#C53030' }}>{ct.giaTriDo || '—'}</td>
                        <td style={{ ...tdStyle, color: '#4A5568' }}>{ct.gioiHanChoPhep || '—'}</td>
                        <td style={tdStyle}>
                          {isCtDat ? (
                            <span style={{ color: '#2F855A', background: '#DEF7EC', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <CheckCircle2 style={{ width: 11, height: 11 }} /> Đạt
                            </span>
                          ) : (
                            <span style={{ color: '#9B2C2C', background: '#FDE8E8', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <XCircle style={{ width: 11, height: 11 }} /> Vượt ngưỡng
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#4A5568',
  textAlign: 'left',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: '13px',
  color: '#2D3748',
  verticalAlign: 'middle',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  color: '#4A5568',
  marginBottom: '4px'
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #CBD5E0',
  borderRadius: '5px',
  fontSize: '12.5px',
  outline: 'none',
  background: '#fff',
  color: '#2D3748',
  boxSizing: 'border-box'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #CBD5E0',
  borderRadius: '5px',
  fontSize: '12.5px',
  outline: 'none',
  color: '#2D3748',
  boxSizing: 'border-box'
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #CBD5E0',
  borderRadius: '5px',
  fontSize: '12.5px',
  fontFamily: 'inherit',
  resize: 'vertical',
  outline: 'none',
  color: '#2D3748',
  boxSizing: 'border-box'
};

function InfoRow({
  label,
  value,
  mono,
  children,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p style={{ fontSize: 11, color: '#718096', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</p>
      {children ?? (
        <p style={{ fontSize: 13.5, color: '#1A202C', fontFamily: mono ? 'monospace' : undefined, fontWeight: mono ? 600 : 400 }}>
          {value ?? '—'}
        </p>
      )}
    </div>
  );
}
