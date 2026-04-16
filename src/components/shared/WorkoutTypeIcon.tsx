import React from 'react';
import { WorkoutType } from '@/constants/presets';
import RainDropIcon from './icons/RainDropIcon';
import RunningIcon from './icons/RunningIcon';
import FavouriteIcon from './icons/FavouriteIcon';
import DumbbellIcon from './icons/DumbbellIcon';

type Props = {
  type: WorkoutType;
  color?: string;
  size?: number;
};

export default function WorkoutTypeIcon({ type, color = '#f0f0f0', size = 18 }: Props) {
  switch (type) {
    case 'hiit':
      return <RainDropIcon color={color} size={size} />;
    case 'running':
      return <RunningIcon color={color} size={size} />;
    case 'cardio':
      return <FavouriteIcon color={color} size={size} />;
    case 'strength':
      return <DumbbellIcon color={color} size={size} />;
  }
}
