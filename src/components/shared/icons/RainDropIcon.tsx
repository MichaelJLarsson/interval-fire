import React from 'react';

import Svg, { Path } from 'react-native-svg';

type Props = {
  color?: string;
  size?: number;
};

export default function RainDropIcon({ color = '#f0f0f0', size = 18 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M2.625 10.2585C2.625 7.1204 5.31059 4.0193 7.1956 2.22916C8.21933 1.25695 9.78068 1.25695 10.8044 2.22916C12.6894 4.0193 15.375 7.1204 15.375 10.2585C15.375 13.3353 12.9609 16.5 9 16.5C5.03909 16.5 2.625 13.3353 2.625 10.2585Z"
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}
