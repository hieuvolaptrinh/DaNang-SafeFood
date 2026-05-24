'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const body = await res.json();

      if (!res.ok || body.code !== 200) {
        setError(body.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        return;
      }

      const { accessToken, refreshToken, user } = body.data;
      login({ accessToken, refreshToken }, user);
      router.push('/dashboard');
    } catch {
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#F5F5F5', display:'flex', flexDirection:'column' }}>
      {/* Top bar */}
      <div style={{ background:'#006400', padding:'6px 0', borderBottom:'2px solid #004d00' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:'11px', color:'#fff', opacity:0.8 }}>
            CỔNG THÔNG TIN ĐIỆN TỬ — CHI CỤC AN TOÀN THỰC PHẨM TP. ĐÀ NẴNG
          </span>
          <span style={{ fontSize:'11px', color:'#fff', opacity:0.7 }}>
            Đường dây hỗ trợ: (0236) 3.819.879
          </span>
        </div>
      </div>

      {/* Header banner */}
      <div style={{ background:'#006400', padding:'20px 0', borderBottom:'2px solid #004d00' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 20px', display:'flex', alignItems:'center', gap:'16px' }}>
          <div style={{ width:'70px', height:'70px', borderRadius:'50%', background:'#fff', border:'2px solid rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
            <Image src="/logo-attp.png" alt="Logo ATTP" width={60} height={60} style={{ objectFit:'contain' }} />
          </div>
          <div>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'10.5px', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 2px 0' }}>
              Sở Y Tế TP. Đà Nẵng
            </p>
            <h1 style={{ color:'#fff', fontSize:'20px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', margin:0, lineHeight:1.2 }}>
              Chi Cục An Toàn Thực Phẩm
            </h1>
            <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'14px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', margin:'2px 0 0 0' }}>
              Thành Phố Đà Nẵng
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 20px' }}>
        <div style={{ display:'flex', gap:'40px', maxWidth:'900px', width:'100%', alignItems:'flex-start' }}>
          {/* Left: Info */}
          <div style={{ flex:1 }}>
            <h2 style={{ fontSize:'16px', fontWeight:700, color:'#006400', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'12px', borderBottom:'2px solid #008000', paddingBottom:'6px' }}>
              Hệ thống Phần mềm Quản lý ATTP
            </h2>
            <p style={{ fontSize:'13px', color:'#444', lineHeight:1.7, marginBottom:'16px' }}>
              Hệ thống quản lý an toàn thực phẩm thành phố Đà Nẵng phục vụ nghiệp vụ cho cán bộ, nhân viên
              Chi cục An toàn Thực phẩm, Sở Y tế và các cơ sở kinh doanh thực phẩm.
            </p>

            <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'20px' }}>
              {[
                { label:'Quản lý cơ sở kinh doanh thực phẩm' },
                { label:'Thanh tra, kiểm tra và cấp giấy chứng nhận ATTP' },
                { label:'Tiếp nhận và xử lý phản ánh của người dân' },
                { label:'Báo cáo thống kê và cảnh báo an toàn thực phẩm' },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12.5px', color:'#333' }}>
                  <span style={{ width:'6px', height:'6px', background:'#008000', borderRadius:'1px', flexShrink:0 }} />
                  {item.label}
                </div>
              ))}
            </div>

            <div style={{ padding:'10px 12px', background:'#EAF7EA', border:'1px solid #94C994', borderLeft:'4px solid #008000', borderRadius:'2px', fontSize:'12px', color:'#006400' }}>
              <strong>Hỗ trợ kỹ thuật:</strong> Phòng Công nghệ thông tin — Sở Y tế TP. Đà Nẵng<br />
              Điện thoại: <strong>(0236) 3.819.879</strong> | Email: <strong>cntt@soytedn.gov.vn</strong>
            </div>
          </div>

          {/* Right: Login form */}
          <div style={{ width:'340px', flexShrink:0 }}>
            <div style={{ background:'#fff', border:'1px solid #D6D6D6', borderRadius:'2px' }}>
              {/* Form header */}
              <div style={{ background:'#006400', padding:'10px 16px', borderBottom:'2px solid #004d00' }}>
                <h2 style={{ color:'#fff', fontSize:'13px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', margin:0 }}>
                  Đăng nhập hệ thống
                </h2>
              </div>

              <form onSubmit={handleLogin} style={{ padding:'20px 16px' }}>
                {error && (
                  <div style={{ marginBottom:'12px', padding:'8px 10px', background:'#FFF3F3', border:'1px solid #F5C6CB', borderLeft:'4px solid #CC0000', borderRadius:'2px', fontSize:'12px', color:'#CC0000' }}>
                    {error}
                  </div>
                )}

                <div style={{ marginBottom:'12px' }}>
                  <label style={{ display:'block', fontSize:'12.5px', fontWeight:600, color:'#333', marginBottom:'4px' }}>
                    Tên đăng nhập <span style={{ color:'#CC0000' }}>*</span>
                  </label>
                  <input
                    id="login-username"
                    type="text"
                    placeholder="Nhập tên đăng nhập..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="gov-input"
                    style={{ height:'32px' }}
                    required
                    autoComplete="username"
                  />
                </div>

                <div style={{ marginBottom:'12px' }}>
                  <label style={{ display:'block', fontSize:'12.5px', fontWeight:600, color:'#333', marginBottom:'4px' }}>
                    Mật khẩu <span style={{ color:'#CC0000' }}>*</span>
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Nhập mật khẩu..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="gov-input"
                    style={{ height:'32px' }}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <div style={{ marginBottom:'14px', display:'flex', alignItems:'center', gap:'6px' }}>
                  <input type="checkbox" id="remember" style={{ width:'14px', height:'14px', accentColor:'#008000', cursor:'pointer' }} defaultChecked />
                  <label htmlFor="remember" style={{ fontSize:'12px', color:'#444', cursor:'pointer' }}>Ghi nhớ đăng nhập</label>
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  style={{
                    width:'100%',
                    height:'34px',
                    background: loading ? '#4d8a4d' : '#008000',
                    color:'#fff',
                    border:'1px solid #006400',
                    borderRadius:'2px',
                    fontSize:'13px',
                    fontWeight:600,
                    textTransform:'uppercase',
                    letterSpacing:'0.04em',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Đang xác thực...' : 'Đăng nhập'}
                </button>

                <div style={{ marginTop:'12px', textAlign:'center' }}>
                  <a href="#" style={{ fontSize:'12px', color:'#008000' }}>Quên mật khẩu?</a>
                  <span style={{ color:'#CCC', margin:'0 8px' }}>|</span>
                  <a href="#" style={{ fontSize:'12px', color:'#008000' }}>Hướng dẫn sử dụng</a>
                </div>
              </form>

              <div style={{ padding:'8px 16px', background:'#EEEEEE', borderTop:'1px solid #D6D6D6', fontSize:'11px', color:'#777', textAlign:'center' }}>
                © 2026 Chi cục An toàn Thực phẩm TP. Đà Nẵng — v2.1.0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background:'#006400', borderTop:'2px solid #004d00', padding:'8px 0' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 20px', display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.7)' }}>
            © 2026 Chi cục An toàn Thực phẩm TP. Đà Nẵng — Sở Y tế TP. Đà Nẵng
          </span>
          <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)' }}>
            Địa chỉ: 99 Phan Chu Trinh, Hải Châu, Đà Nẵng
          </span>
        </div>
      </div>
    </div>
  );
}
