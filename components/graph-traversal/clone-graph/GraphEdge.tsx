type Props = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  width: number;
  opacity?: number;
};

export default function GraphEdge({
  x1,
  y1,
  x2,
  y2,
  stroke,
  width,
  opacity = 1,
}: Props) {
  return (
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
  );
}
