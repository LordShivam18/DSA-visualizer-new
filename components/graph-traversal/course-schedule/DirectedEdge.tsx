type Props = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  width: number;
  opacity: number;
};

export default function DirectedEdge({
  x1,
  y1,
  x2,
  y2,
  stroke,
  width,
  opacity,
}: Props) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const endX = x2 - Math.cos(angle) * 48;
  const endY = y2 - Math.sin(angle) * 48;
  const headLength = 10;
  const headAngle = Math.PI / 7;

  const leftX = endX - Math.cos(angle - headAngle) * headLength;
  const leftY = endY - Math.sin(angle - headAngle) * headLength;
  const rightX = endX - Math.cos(angle + headAngle) * headLength;
  const rightY = endY - Math.sin(angle + headAngle) * headLength;

  return (
    <g opacity={opacity}>
      <line
        x1={x1}
        y1={y1}
        x2={endX}
        y2={endY}
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
      />
      <path
        d={`M ${leftX} ${leftY} L ${endX} ${endY} L ${rightX} ${rightY}`}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}
