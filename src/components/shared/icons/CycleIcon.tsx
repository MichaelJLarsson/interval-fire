import React from 'react';

import Svg, { Path } from 'react-native-svg';

type Props = { color?: string; size?: number };

export default function CycleIcon({ color = '#00E5A0', size = 18 }: Props) {
  return (
    <Svg width={size} height={size * 20 / 21} viewBox="0 0 21 20" fill="none">
      <Path
        d="M7.4 1.90883C3.59242 2.77042 0.75 6.16613 0.75 10.2239C0.75 10.7081 0.79047 11.1828 0.868218 11.6449M7.4 1.90883L4.55 0.750183M7.4 1.90883L6.45 4.53966M16.9613 14.0133C17.5301 12.8718 17.85 11.585 17.85 10.2239C17.85 5.99909 14.7688 2.49197 10.725 1.81544M16.9613 14.0133L19.75 12.1186M16.9613 14.0133L15.475 11.1712M2.18977 14.9607C3.72357 17.2458 6.3356 18.7502 9.3 18.7502C11.4898 18.7502 13.4873 17.9292 15 16.5791M2.18977 14.9607H5.5M2.18977 14.9607V18.2765"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
