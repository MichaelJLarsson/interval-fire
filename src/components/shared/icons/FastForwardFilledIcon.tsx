import React from 'react'

import Svg, { Path } from 'react-native-svg'

type Props = {
  color?: string
  size?: number
}

export default function FastForwardFilledIcon({ color = '#f0f0f0', size = 18 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2.5 18V6L11.5 12L2.5 18ZM12.5 18V6L21.5 12L12.5 18Z" fill={color} />
    </Svg>
  )
}
