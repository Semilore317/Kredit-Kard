export default function StatusBadge({ status }: { status: "PENDING" | "PAID" | "CANCELLED" }) {
  if (status === "PAID") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-4 bg-green-100 text-green-800 border border-green-200 uppercase tracking-wider">
        Paid
      </span>
    );
  }
  
  if (status === "CANCELLED") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-4 bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wider">
        Cancelled
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-4 bg-red-100 text-red-800 border border-red-200 uppercase tracking-wider shadow-sm">
      Pending
    </span>
  );
}
