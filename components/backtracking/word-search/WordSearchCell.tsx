type Props = {
  value: string;
  toneClass: string;
  label?: string;
};

export default function WordSearchCell({ value, toneClass, label }: Props) {
  return (
    <div
      className={`relative flex aspect-square items-center justify-center rounded-xl border text-2xl font-semibold transition-all duration-300 ${toneClass}`}
    >
      <span>{value || "-"}</span>
      {label ? (
        <span className="absolute bottom-1 right-1 text-[10px] uppercase tracking-[0.16em] text-current/60">
          {label}
        </span>
      ) : null}
    </div>
  );
}
