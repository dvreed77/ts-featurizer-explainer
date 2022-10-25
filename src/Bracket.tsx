import * as d3 from "d3";

interface IProps {
  width: number;
  height: number;
  label: string;
  color?: string;
}

export const Bracket = ({ width, height, label, color = "#aaa" }: IProps) => {
  const path = d3.path();

  path.moveTo(0, 0);
  path.lineTo(width, 5);
  path.lineTo(width, height - 5);
  path.lineTo(0, height);

  return (
    <g>
      <path d={path.toString()} stroke={color} strokeWidth={1} fill="none" />
      <line
        x1={width}
        x2={width + 5}
        y1={height / 2}
        y2={height / 2}
        stroke={color}
        strokeWidth={1}
      />
      <text
        x={width + 10}
        y={height / 2}
        fontSize={10}
        alignmentBaseline="middle"
        fill={color}
      >
        {label}
      </text>
    </g>
  );
};