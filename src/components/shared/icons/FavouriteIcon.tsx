import React from 'react'

import Svg, { Path } from 'react-native-svg'

type Props = {
  color?: string
  size?: number
}

export default function FavouriteIcon({ color = '#f0f0f0', size = 18 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M7.80802 14.9758C5.69206 13.3935 1.5 9.7761 1.5 6.52083C1.5 4.36922 3.07894 2.625 5.25 2.625C6.375 2.625 7.5 3 9 4.5C10.5 3 11.625 2.625 12.75 2.625C14.921 2.625 16.5 4.36922 16.5 6.52083C16.5 9.7761 12.3079 13.3935 10.192 14.9758C9.47992 15.5082 8.52007 15.5082 7.80802 14.9758Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
