type Props = {
  row: number;
  col: number;
  toneClass: string;
  label: string;
};

export default function ChessboardCell({ row, col, toneClass, label }: Props) {
  return (
    <div
      className={`relative flex aspect-square items-center justify-center rounded-xl border text-lg font-semibold transition-all duration-300 ${toneClass}`}
    >
      <span>{label}</span>
      <span className="absolute bottom-1 right-1 text-[10px] uppercase tracking-[0.14em] text-current/55">
        {row},{col}
      </span>
    </div>
  );
}
