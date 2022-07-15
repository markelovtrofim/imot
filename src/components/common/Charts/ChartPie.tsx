import React, { FC } from 'react';

import { 
  PieChart, 
  Pie,
  ResponsiveContainer 
} from 'recharts';

type ChartPiePropsType = {
  data: {}[],
  width: number,
  height: number,
  dataKey: string[],
}

const ChartPie: FC<ChartPiePropsType>= React.memo(({data, width, height, dataKey}) => {
  return (
    <ResponsiveContainer width={'100%'} height={height}>
     <PieChart width={400} height={height}>
        <Pie data={data} dataKey={dataKey[0]} cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label />
      </PieChart>
    </ResponsiveContainer>
  )
})

export default ChartPie;
