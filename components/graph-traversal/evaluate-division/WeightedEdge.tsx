type Props = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  width: number;
  opacity: number;
  label: string;
  labelToneClass: string;
};

export default function WeightedEdge({
  x1,
  y1,
  x2,
  y2,
  stroke,
  width,
  opacity,
  label,
  labelToneClass,
}: Props) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const offsetX = Math.cos(angle + Math.PI / 2) * 16;
  const offsetY = Math.sin(angle + Math.PI / 2) * 16;

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={width}
        opacity={opacity}
        strokeLinecap="round"
      />
      <foreignObject
        x={midX + offsetX - 56}
        y={midY + offsetY - 16}
        width={112}
        height={36}
      >
        <div className="flex h-full items-center justify-center">
          <span
            className={`rounded-full border px-2 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase shadow-[0_0_16px_rgba(15,23,42,0.4)] ${labelToneClass}`}
          >
            {label}
          </span>
        </div>
      </foreignObject>
    </g>
  );
}
