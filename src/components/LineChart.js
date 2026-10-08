import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { colors } from '../theme/theme';

// Gráfico de linha leve, sem dependências pesadas — traça uma ou mais séries
// normalizadas dentro de uma viewBox fixa.
export default function LineChart({
  series,
  width = 260,
  height = 90,
  padding = 8,
}) {
  const allValues = series.flatMap((s) => s.data);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  const toPoints = (data) =>
    data
      .map((v, i) => {
        const x =
          padding + (i / (data.length - 1)) * (width - padding * 2);
        const y =
          height -
          padding -
          ((v - min) / range) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');

  return (
    <Svg width={width} height={height}>
      <Line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke={colors.divider}
        strokeWidth={1}
      />
      {series.map((s, idx) => (
        <Polyline
          key={idx}
          points={toPoints(s.data)}
          fill="none"
          stroke={s.color}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {series.map((s, idx) => {
        const lastX = width - padding;
        const lastY =
          height -
          padding -
          ((s.data[s.data.length - 1] - min) / range) * (height - padding * 2);
        return (
          <Circle key={`dot-${idx}`} cx={lastX} cy={lastY} r={3.5} fill={s.color} />
        );
      })}
    </Svg>
  );
}
