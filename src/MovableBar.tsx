import { useState, MouseEventHandler } from "react";
import { roundNearest } from "./utils";

interface IProps {
  x: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  height: number;
  color?: string;
  opacity?: number;
}

export const MovableHandle = ({
  x,
  onChange,
  min,
  max,
  step,
  height,
  color = "black",
  opacity = 1,
}: IProps) => {
  const [dragging, setDragging] = useState(false);

  const handleMouseDown: MouseEventHandler<SVGLineElement> = (e) => {
    let lastX = NaN;
    const initialStart = x;
    e.preventDefault();
    setDragging(true);
    const handleMouseMove = (e2: MouseEvent) => {
      const dx = e2.pageX - e.pageX;

      if (dx === 0) return;
      const newX = initialStart + dx;

      if (newX === lastX) return;

      if (newX >= min && newX <= max) {
        onChange(roundNearest(newX, step));
        lastX = newX;
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener(
      "mouseup",
      () => {
        setDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
      },
      { once: true }
    );
  };
  return (
    <line
      x1={x}
      x2={x}
      y1={0}
      y2={height}
      stroke="black"
      strokeWidth={dragging ? 4 * 10 : 10}
      opacity={0}
      style={{ cursor: "ew-resize" }}
      onMouseDown={handleMouseDown}
    />
  );
};
