"use client";

export default function RatingPopover(props: any) {
  const rating = Number(props.rating || props.value || 0);
  const reviews = Number(props.reviews || props.count || 0);

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-black text-white">
      {rating.toFixed(1)} ★
      <span className="text-white/80">({reviews})</span>
    </span>
  );
}