import React, { FC } from 'react';

import { useAppSelector } from '../../../hooks/redux';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { RootState } from '../../../store/store';
import { translate } from '../../../localizations';
import { BlockBox } from "../../common";
import ChartBar from '../../common/Charts/ChartBar';
import ChartRadar from '../../common/Charts/ChartRadar';
import ChartPie from '../../common/Charts/ChartPie';
import ChartArea from '../../common/Charts/ChartArea';

type ChartsBlockType = {
  chartTypeValue: {
    label: string,
    value: string
  }
  tableRows: {}[]
  dataChart: [],
  handleCheckChart: (event: React.ChangeEvent<HTMLInputElement>) => void,
  checkChart: string,
}

const ChartsBlock: FC<ChartsBlockType> = React.memo(({ chartTypeValue, tableRows , dataChart, handleCheckChart, checkChart }) => {
  const { language } = useAppSelector((state: RootState) => state.lang);
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px', zIndex: '5'}}>
      <BlockBox padding="24px" width="calc(70% - 30px)">
        <div>
          {/* to do: подготовить данные */}
          {chartTypeValue.value === 'lineChart' ? 
            <div style={{marginTop: '30px', width: '100%'}}>
            <ChartArea
              data={tableRows}
              width={800}
              height={300}
              dataKey={dataChart}
            />
          </div>
          : <></>
          }

          {chartTypeValue.value === 'barChart' ? 
            <div style={{marginTop: '30px', width: '100%'}}>
              <ChartBar
                data={tableRows}
                width={800}
                height={400}
                dataKey={dataChart}
              />
            </div>
            : <></>
          }
          {/* to do: подготовить данные */}
          {chartTypeValue.value === 'radarChart' ? 
            <div style={{marginTop: '30px', width: '100%'}}>
              <ChartRadar
                data={tableRows}
                width={800}
                height={300}
                dataKey={dataChart}
              />
            </div>
            : <></>
          }
          {/* to do: подготовить данные */}
          {chartTypeValue.value === 'pieChart' ? 
            <div style={{marginTop: '30px', width: '100%'}}>
              <ChartPie
                data={tableRows}
                width={800}
                height={300}
                dataKey={dataChart}
              />
            </div>
            : <></>
          }
        </div>
      </BlockBox>
      <BlockBox padding="24px" height="300px" width="30%">  
        <FormGroup>
          <FormControl>
            <FormLabel id="radio-buttons-group" style={{marginBottom: '10px'}}>{translate('reportShow', language)}</FormLabel>
              <RadioGroup
                aria-labelledby="radio-buttons-group"
                defaultValue="calls"
                name="radio-buttons-group"
                onChange={handleCheckChart}
                value={checkChart}
              >
              <FormControlLabel value="calls" control={<Radio />} label={`${translate('reportCalls', language)}`} />
              <FormControlLabel value="minutes" control={<Radio />} label={`${translate('reportMinutes', language)}`} />
              <FormControlLabel value="percent" control={<Radio />} label={`${translate('reportPercent', language)}`} />
            </RadioGroup>
          </FormControl>
        </FormGroup>
      </BlockBox>
    </div>
  )
})

export default ChartsBlock;