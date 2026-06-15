import React from 'react';

import Svg, { Path } from 'react-native-svg';

type Props = {
  color?: string;
  size?: number;
};

export default function PauseIcon({ color = '#f0f0f0', size = 18 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path
        d="M23.3333 31.6666V8.33331H30V31.6666H23.3333ZM10 31.6666V8.33331H16.6667V31.6666H10Z"
        fill={color}
      />
    </Svg>
  );
}
