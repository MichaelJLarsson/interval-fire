import React from 'react';

import Svg, { Path } from 'react-native-svg';

type Props = {
  color?: string;
  size?: number;
};

export default function RunningIcon({ color = '#f0f0f0', size = 18 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M12.75 3.375C12.75 3.99632 12.2463 4.5 11.625 4.5C11.0037 4.5 10.5 3.99632 10.5 3.375C10.5 2.75368 11.0037 2.25 11.625 2.25C12.2463 2.25 12.75 2.75368 12.75 3.375Z"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M11.25 15.7506L10.7519 13.7886C10.5871 13.1393 10.2461 12.5463 9.76553 12.0731L8.625 10.9498M8.625 10.9498C7.86915 10.3544 7.49126 10.0567 7.34485 9.6588C7.27963 9.4815 7.24847 9.29355 7.25302 9.10477C7.26322 8.68087 7.5249 8.27715 8.04818 7.46967L9 6.00102M8.625 10.9498L11.25 6.95807M4.5 8.36505C5.25 6.88775 6.40325 6.03172 9 6.00102M9 6.00102C9.16395 5.99908 9.4083 5.99849 9.65235 5.99854C10.031 5.9986 10.2203 5.99864 10.3712 6.06911C10.522 6.13957 10.6767 6.32442 10.9862 6.69411C11.0748 6.80004 11.1659 6.89494 11.25 6.95807M11.25 6.95807C12.116 7.60747 13.472 7.86907 15 6.14935"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 13.2977L3.50866 13.4187C4.80497 13.7271 6.15243 13.1373 6.75 12"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
