import React, { FC } from 'react';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ReferenceLine, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';

type ChartBarPropsType = {
  data: {}[],
  width: number,
  height: number,
  dataKey: string[],
}

interface ColorType  {
  [key: string]: string
}
const color: ColorType = {
  green: '#95DE64',
  orange: '#95DE64',
  orange2: '#FFA940',
  red:'#FF4D4F',
  blue: '#597EF7',
  purple: '#B37FEB' ,
  darkYellow: '#D46B08',
  cyan: '#36CFC9',
  magenta: '#F759AB'
}
export const getRandomColor = () => {
  const keys = Object.keys(color);
  return color[keys[Math.floor(Math.random() * keys.length)]];
}


const ChartBar: FC<ChartBarPropsType>= React.memo(({data, width, height, dataKey}) => {
  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <BarChart
        width={width}
        height={height}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="idName" />
        <YAxis />
        <Tooltip />
        <Legend height={36}/>
        <ReferenceLine y={0} stroke="#000" />
        {dataKey.map((item,index) => {
          return (
            <Bar dataKey={item} fill={getRandomColor()} stackId="stack" />
          )
        })}
      </BarChart>
    </ResponsiveContainer>
    
//  <ResponsiveContainer width="100%" height="100%">
//   <ComposedChart
//     layout="vertical"
//     width={500}
//     height={300}
//     data={data}
//     margin={{
//       top: 5,
//       right: 30,
//       left: 20,
//       bottom: 5,
//     }}
//   >
//     <CartesianGrid strokeDasharray="3 3" />
//     <XAxis />
//     <YAxis dataKey="idName"/>
//     <Tooltip />
//     <Legend />
//     <Bar dataKey='calls_count_0'  fill="#8884d8" background={{ fill: '#eee' }} />
//     {/* <Bar dataKey='calls_minutes_0' fill="#82ca9d" />
//   </ComposedChart>
// </ResponsiveContainer>
  )
})

export default ChartBar;
