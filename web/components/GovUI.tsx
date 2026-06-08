/**
 * GovUI — Shared UI primitives for Chi cục ATTP TP. Đà Nẵng
 * All pages MUST use these components for consistency.
 */
import { ReactNode, CSSProperties } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// PAGE HEADER
// ─────────────────────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #D6D6D6',
        borderLeft: '4px solid #008000',
        borderRadius: '1px',
        padding: '9px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        gap: '12px',
      }}
    >
      <div>
        <h1
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#006400',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{subtitle}</p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>{actions}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GOV BUTTON
// ─────────────────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'warning';

const BTN_STYLES: Record<BtnVariant, CSSProperties> = {
  primary:   { background: '#008000', color: '#fff', border: '1px solid #006400' },
  secondary: { background: '#fff',    color: '#333', border: '1px solid #D6D6D6' },
  danger:    { background: '#CC0000', color: '#fff', border: '1px solid #aa0000' },
  outline:   { background: '#fff',    color: '#008000', border: '1px solid #008000' },
  warning:   { background: '#CC6600', color: '#fff', border: '1px solid #aa5500' },
};

interface GovBtnProps {
  children: ReactNode;
  variant?: BtnVariant;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  size?: 'sm' | 'md';
  title?: string;
}
export function GovBtn({
  children,
  variant = 'secondary',
  onClick,
  type = 'button',
  disabled,
  size = 'md',
  title,
}: GovBtnProps) {
  const height = size === 'sm' ? '24px' : '30px';
  const fontSize = size === 'sm' ? '11px' : '12.5px';
  const padding = size === 'sm' ? '0 7px' : '0 12px';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        ...BTN_STYLES[variant],
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        height,
        padding,
        borderRadius: '2px',
        fontSize,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        whiteSpace: 'nowrap',
        fontFamily: 'inherit',
        transition: 'background-color 0.15s',
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER BAR
// ─────────────────────────────────────────────────────────────────────────────
export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: '#EEEEEE',
        border: '1px solid #D6D6D6',
        borderRadius: '2px',
        padding: '8px 12px',
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '8px',
        alignItems: 'flex-end',
        marginBottom: '10px',
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER FIELD wrapper
// ─────────────────────────────────────────────────────────────────────────────
export function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '11.5px',
          fontWeight: 600,
          color: '#444',
          marginBottom: '3px',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GOV INPUT
// ─────────────────────────────────────────────────────────────────────────────
interface GovInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  width?: string | number;
  type?: string;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
}
export function GovInput({ placeholder, value, onChange, width = 180, type = 'text', name, id, required, disabled }: GovInputProps) {
  return (
    <input
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      required={required}
      disabled={disabled}
      style={{
        height: '30px',
        border: '1px solid #D6D6D6',
        borderRadius: '2px',
        padding: '0 8px',
        background: disabled ? '#F5F5F5' : '#fff',
        outline: 'none',
        fontSize: '13px',
        color: disabled ? '#666' : '#222',
        width: typeof width === 'number' ? `${width}px` : width,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : undefined,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GOV SELECT
// ─────────────────────────────────────────────────────────────────────────────
interface GovSelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (v: string) => void;
  width?: string | number;
  name?: string;
  id?: string;
}
export function GovSelect({ options, value, onChange, width = 160, name, id }: GovSelectProps) {
  return (
    <select
      name={name}
      id={id}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      style={{
        height: '30px',
        border: '1px solid #D6D6D6',
        borderRadius: '2px',
        padding: '0 24px 0 8px',
        background: '#fff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' viewBox=\'0 0 10 6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%23666\'/%3E%3C/svg%3E") no-repeat right 8px center',
        appearance: 'none' as const,
        outline: 'none',
        fontSize: '13px',
        color: '#222',
        width: typeof width === 'number' ? `${width}px` : width,
        fontFamily: 'inherit',
        cursor: 'pointer',
      }}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CARD (title + body)
// ─────────────────────────────────────────────────────────────────────────────
interface SectionCardProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
}
export function SectionCard({ title, children, actions, footer }: SectionCardProps) {
  return (
    <section
      style={{
        background: '#fff',
        border: '1px solid #D6D6D6',
        borderRadius: '1px',
        overflow: 'hidden',
        marginBottom: '12px',
      }}
    >
      <header
        style={{
          background: '#EAF7EA',
          borderBottom: '2px solid #008000',
          padding: '7px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap' as const,
        }}
      >
        <h2
          style={{
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#006400',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            margin: 0,
          }}
        >
          {title}
        </h2>
        {actions && <div style={{ display: 'flex', gap: '6px' }}>{actions}</div>}
      </header>
      <div>{children}</div>
      {footer && (
        <footer
          style={{
            padding: '6px 12px',
            borderTop: '1px solid #D6D6D6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#555',
            background: '#FAFAFA',
          }}
        >
          {footer}
        </footer>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GOV PAGINATION
// ─────────────────────────────────────────────────────────────────────────────
interface GovPaginationProps {
  info: string;
  total?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (p: number) => void;
}
export function GovPagination({
  info,
  total = 3,
  page = 0,
  totalPages,
  onPageChange,
}: GovPaginationProps) {
  const activePage = page;
  const finalTotalPages = totalPages ?? total;

  const handlePageClick = (p: number) => {
    if (onPageChange && p >= 0 && p < finalTotalPages) {
      onPageChange(p);
    }
  };

  const pages = Array.from({ length: finalTotalPages }, (_, i) => i);
  const start = Math.max(0, Math.min(activePage - 2, Math.max(0, finalTotalPages - 5)));
  const visiblePages = pages.slice(start, start + 5);

  return (
    <>
      <span style={{ fontSize: '12px', color: '#555' }}>{info}</span>
      <nav style={{ display: 'flex', gap: '3px' }}>
        <button
          type="button"
          onClick={() => handlePageClick(activePage - 1)}
          disabled={activePage === 0}
          style={{
            minWidth: '26px',
            height: '24px',
            borderRadius: '2px',
            border: '1px solid #D6D6D6',
            background: '#fff',
            color: activePage === 0 ? '#aaa' : '#333',
            fontSize: '12px',
            cursor: activePage === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          «
        </button>

        {visiblePages.map((p) => {
          const isCurrent = p === activePage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => handlePageClick(p)}
              style={{
                minWidth: '26px',
                height: '24px',
                borderRadius: '2px',
                border: isCurrent ? '1px solid #008000' : '1px solid #D6D6D6',
                background: isCurrent ? '#008000' : '#fff',
                color: isCurrent ? '#fff' : '#333',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: isCurrent ? 600 : 400,
                fontFamily: 'inherit',
              }}
            >
              {p + 1}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => handlePageClick(activePage + 1)}
          disabled={activePage >= finalTotalPages - 1}
          style={{
            minWidth: '26px',
            height: '24px',
            borderRadius: '2px',
            border: '1px solid #D6D6D6',
            background: '#fff',
            color: activePage >= finalTotalPages - 1 ? '#aaa' : '#333',
            fontSize: '12px',
            cursor: activePage >= finalTotalPages - 1 ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          »
        </button>
      </nav>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────
const BADGE_MAP: Record<string, { label: string; bg: string; color: string; border: string }> = {
  // Result
  pass:           { label: 'Đạt',           bg: '#E6F4E6', color: '#006400', border: '#94C994' },
  fail:           { label: 'Không đạt',     bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  scheduled:      { label: 'Đã lên lịch',  bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
  // Status
  active:         { label: 'Hoạt động',    bg: '#E6F4E6', color: '#006400', border: '#94C994' },
  suspended:      { label: 'Tạm đình chỉ', bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  pending:        { label: 'Chờ xử lý',    bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  expired:        { label: 'Hết hạn',      bg: '#F0F0F0', color: '#555',    border: '#CCC'    },
  open:           { label: 'Đang mở',      bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  'in-progress':  { label: 'Đang xử lý',  bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  resolved:       { label: 'Đã xử lý',    bg: '#E6F4E6', color: '#006400', border: '#94C994' },
  processing:     { label: 'Đang xử lý',  bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  // Severity
  high:           { label: 'Nghiêm trọng', bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  medium:         { label: 'Trung bình',   bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  low:            { label: 'Nhẹ',          bg: '#F0F0F0', color: '#555',    border: '#CCC'    },
  'nghiêm trọng': { label: 'Nghiêm trọng', bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  'trung bình':   { label: 'Trung bình',   bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  'nhẹ':          { label: 'Nhẹ',          bg: '#F0F0F0', color: '#555',    border: '#CCC'    },
  // Log level
  INFO:           { label: 'INFO',         bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
  WARN:           { label: 'CẢNH BÁO',    bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  ERROR:          { label: 'LỖI',         bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  // Complaint
  'pending-complaint': { label: 'Chưa xử lý', bg: '#F0F0F0', color: '#555', border: '#CCC' },
};

export function StatusBadge({ variant, label }: { variant: string; label?: string }) {
  const cfg = BADGE_MAP[variant] ?? { label: variant, bg: '#F0F0F0', color: '#555', border: '#CCC' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px 7px',
        borderRadius: '2px',
        border: `1px solid ${cfg.border}`,
        background: cfg.bg,
        color: cfg.color,
        fontSize: '11px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {label ?? cfg.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM SECTION (for forms with labeled fields)
// ─────────────────────────────────────────────────────────────────────────────
export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        style={{
          background: '#EAF7EA',
          borderBottom: '2px solid #008000',
          padding: '5px 10px',
          marginBottom: '10px',
        }}
      >
        <h3
          style={{
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#006400',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', padding: '0 4px' }}>
        {children}
      </div>
    </div>
  );
}

export function FormField({
  label,
  children,
  required,
  fullWidth,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div style={{ gridColumn: fullWidth ? '1 / -1' : undefined }}>
      <label
        style={{
          display: 'block',
          fontSize: '12.5px',
          fontWeight: 600,
          color: '#333',
          marginBottom: '4px',
        }}
      >
        {label}
        {required && <span style={{ color: '#CC0000', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT MINI WIDGET (for top-of-page stats row)
// ─────────────────────────────────────────────────────────────────────────────
type MiniStatColor = 'green' | 'red' | 'orange' | 'blue' | 'neutral';
const MINI_STAT_COLORS: Record<MiniStatColor, { border: string; labelColor: string }> = {
  green:   { border: '#008000', labelColor: '#555' },
  red:     { border: '#CC0000', labelColor: '#555' },
  orange:  { border: '#CC6600', labelColor: '#555' },
  blue:    { border: '#005A9E', labelColor: '#555' },
  neutral: { border: '#888',    labelColor: '#555' },
};

/** Nhóm nút thao tác đồng bộ (toolbar / bảng) */
export function ActionButtons({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
      {children}
    </div>
  );
}

/** Bố cục form hành chính — bọc các FormSection */
export function FormLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #D6D6D6',
        borderRadius: '2px',
        padding: '12px 14px',
      }}
    >
      {children}
    </div>
  );
}

export function MiniStat({
  label,
  value,
  color = 'green',
  note,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  icon: _icon,
}: {
  label: string;
  value: string | number;
  color?: MiniStatColor;
  note?: string;
  icon?: React.ComponentType<{ style?: React.CSSProperties }>;
}) {
  const c = MINI_STAT_COLORS[color];
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #D6D6D6',
        borderTop: `3px solid ${c.border}`,
        borderRadius: '1px',
        padding: '10px 14px',
      }}
    >
      <p
        style={{
          fontSize: '10.5px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: c.labelColor,
          marginBottom: '4px',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#222',
          margin: 0,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </p>
      {note && (
        <p style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>{note}</p>
      )}
    </div>
  );
}

export const StatsCard = MiniStat;
