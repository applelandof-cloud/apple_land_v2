import React from 'react';
import { cn } from '@/lib/utils';

interface Color {
  id: number;
  name: string;
  hex_code: string;
}

interface ColorDisplayProps {
  color: Color;
  className?: string;
}

export const ColorDisplay: React.FC<ColorDisplayProps> = ({ color, className }) => {
  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded-full border px-2 py-1 text-sm w-fit",
        className
      )}
      style={{
        backgroundColor: color.hex_code ? `${color.hex_code}20` : 'transparent',
      }}
    >
      <span
        className="h-3 w-3 rounded-full border"
        style={{ backgroundColor: color.hex_code }}
      ></span>
      {color.name}
    </span>
  );
};
