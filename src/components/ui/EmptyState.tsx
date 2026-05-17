export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass-card flex min-h-[220px] items-center justify-center p-6 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}
