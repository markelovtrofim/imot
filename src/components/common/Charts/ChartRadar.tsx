import React, { FC } from 'react';

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

import { getRandomColor } from './ChartBar';

type ChartRadarPropsType = {
  data: {}[],
  width: number,
  height: number,
  dataKey: string[],
}

const ChartRadar: FC<ChartRadarPropsType> = ({data, width, height, dataKey}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="idName" />
          <PolarRadiusAxis />

          {dataKey.map((item,index) => {
            const color = getRandomColor();
            return (
            <Radar name="radar" dataKey={item} stroke={color} fill={color} fillOpacity={0.6} />
            )
          })}
        </RadarChart>
    </ResponsiveContainer>
  )
}

export default ChartRadar;