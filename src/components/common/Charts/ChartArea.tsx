import React, { FC } from 'react';

import {  
  XAxis, 
  YAxis, 
  Line, 
  LineChart, 
  Legend,  
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { getRandomColor } from './ChartBar';

type ChartAreaPropsType = {
  data: any[],
  width: number,
  height: number,
  dataKey: string[],
}
const ChartArea: FC<ChartAreaPropsType> = React.memo(({ data, width, height, dataKey }) => {
 return (   
    <ResponsiveContainer width={'100%'} height={300}>
      <LineChart
        width={width}
        height={height}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis dataKey="idName" />
        <YAxis />
        <Tooltip />
        <Legend height={36}/>
        {dataKey.map((item,index) => {
          return (
          <Line type="monotone" dataKey={item} stroke={getRandomColor()} strokeWidth={3} />
          )
        })}
      </LineChart>
    </ResponsiveContainer>
  )
})

export default ChartArea