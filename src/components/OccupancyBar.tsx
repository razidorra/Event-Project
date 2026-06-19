type OccupancyBarProps = {
  current: number;
  max: number;
};

export function OccupancyBar({ current, max }: OccupancyBarProps) {
  const percentage = max <= 0 ? 0 : Math.min((current / max) * 100, 100);

  let barColor = "bg-teal-600";
  if (percentage >= 100) {
    barColor = "bg-rose-600";
  } else if (percentage >= 85) {
    barColor = "bg-amber-500";
  }

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">
          Attendees:{" "}
          <span className="font-semibold text-slate-900">{current}</span> /{" "}
          {max}
        </span>
        <span className="font-medium text-slate-700">
          {Math.round(percentage)}% full
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage >= 100 && (
        <p className="text-xs font-medium text-rose-600">
          This event is already fully booked.
        </p>
      )}
    </div>
  );
}
