import { ReactNode } from 'react';
import { SectionCard, GovPagination, GovInput, FilterBar, FilterField, GovSelect } from '@/components/GovUI';

interface TableCardProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  controls?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Bảng trong section card — API giữ nguyên */
export default function TableCard({
  title,
  children,
  actions,
  controls,
  footer,
  className,
}: TableCardProps) {
  return (
    <div className={className}>
      <SectionCard
        title={title}
        actions={
          (controls || actions) ? (
            <>
              {controls}
              {actions}
            </>
          ) : undefined
        }
        footer={footer}
      >
        {children}
      </SectionCard>
    </div>
  );
}

export function SearchInput({
  placeholder = 'Tìm kiếm...',
  onChange,
}: {
  placeholder?: string;
  onChange?: (value: string) => void;
}) {
  return <GovInput placeholder={placeholder} onChange={onChange} width={180} />;
}

export function FilterSelect({
  options,
  onChange,
  className,
}: {
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <GovSelect
      options={options}
      onChange={onChange}
      width={className ? undefined : 160}
    />
  );
}

export { GovPagination as Pagination, FilterBar, FilterField };
