export default function UnderConstruction({ title = 'Trang đang phát triển' }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="text-5xl mb-4 opacity-40">🚧</div>
      <h3 className="text-lg font-bold text-slate-700 mb-2">{title}</h3>
      <p className="text-[13px] text-slate-400 max-w-xs">
        Trang này đang được phát triển. Nội dung sẽ sớm được cập nhật.
      </p>
    </div>
  );
}
