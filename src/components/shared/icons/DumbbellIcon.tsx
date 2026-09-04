import React from 'react'

import Svg, { Path } from 'react-native-svg'

type Props = {
  color?: string
  size?: number
}

export default function DumbbellIcon({ color = '#f0f0f0', size = 18 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M12 6C11.8171 6.54853 11.4409 6.96958 10.9084 7.20565C9.19815 7.96387 7.96387 9.19815 7.20565 10.9084C6.96958 11.4409 6.54853 11.8171 6 12"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="M2.4 15.6L1.5 16.5M15.6 2.4L16.5 1.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.3412 1.8165L12.207 2.90636L15.0875 5.81372L16.1957 4.73767C16.5283 4.34588 16.6302 4.05074 16.2161 3.50716L15.3867 2.63497L14.546 1.80562C14.0085 1.32355 13.5852 1.58294 13.3412 1.8165Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.5086 2.8182C11.3416 1.93784 11.912 2.5644 12.205 2.91329L15.0608 5.78052C15.4162 6.06548 16.0664 6.6122 15.207 7.46351C15.0683 7.60087 14.9324 7.74472 14.7817 7.86869C14.2253 8.32642 13.6913 7.94699 13.4083 7.59832L10.5015 4.69157C10.1954 4.41665 9.66662 3.91853 10.1132 3.2527C10.2336 3.09904 10.3745 2.95999 10.5086 2.8182Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.44057 16.2151L2.58457 15.3691L1.7716 14.5125C1.28918 14.0301 1.5675 13.5476 1.80574 13.3081L2.91729 12.1952L5.80973 15.1002L4.67125 16.2185C4.27311 16.5435 4.00011 16.643 3.46462 16.2185M4.6675 10.4433C4.37454 10.0944 3.80407 9.46784 2.97112 10.3482C2.83696 10.4899 2.69611 10.629 2.57574 10.7827C2.12912 11.4485 2.65789 11.9467 2.96395 12.2215L5.87079 15.1283C6.15373 15.477 6.68773 15.8564 7.24414 15.3987C7.39488 15.2747 7.53082 15.1309 7.6695 14.9935C8.52892 14.1422 7.87867 13.5955 7.52325 13.3105L4.6675 10.4433Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
