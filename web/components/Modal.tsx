'use client';

import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

/** Modal hành chính — bọc shadcn Dialog, style đồng bộ GovUI */
export default function Modal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  wide,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-sm border-[#D6D6D6] p-0 gap-0 shadow-none max-h-[90vh] overflow-hidden flex flex-col"
        style={{ maxWidth: wide ? 720 : 520 }}
      >
        <DialogHeader
          className="px-4 py-3 border-b border-[#D6D6D6] rounded-none"
          style={{ background: '#EAF7EA' }}
        >
          <DialogTitle
            className="text-[13px] font-bold uppercase tracking-wide m-0"
            style={{ color: '#006400' }}
          >
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 py-3 overflow-y-auto flex-1 text-[13px] text-[#222]">
          {children}
        </div>
        {footer && (
          <div className="px-4 py-3 border-t border-[#D6D6D6] bg-[#FAFAFA] flex justify-end gap-2 shrink-0">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
