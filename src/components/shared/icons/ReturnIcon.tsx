import React from 'react';

import Svg, { Path } from 'react-native-svg';

type Props = {
  color?: string;
  size?: number;
};

export default function ReturnIcon({ color = '#f0f0f0', size = 18 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 10L4 15L9 20"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 15H14C17.3137 15 20 12.3137 20 9V4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
