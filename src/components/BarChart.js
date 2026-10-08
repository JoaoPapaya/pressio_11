import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { colors } from '../theme/theme';

export default function BarChart({
  data,
  width = 120,
  height = 70,
  barColor = colors.accentCyan,
  gap = 4,
}) {
  const max = Math.max(...data);
  const barWidth = (width - gap * (data.length - 1)) / data.length;

  return (
    <Svg width={width} height={height}>
      {data.map((v, i) => {
        const barHeight = (v / max) * height;
        const x = i * (barWidth + gap);
        const y = height - barHeight;
        const isLast = i === data.length - 1;
        return (
          <Rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill={isLast ? colors.gold : barColor}
            opacity={isLast ? 1 : 0.55}
          />
        );
      })}
    </Svg>
  );
}
