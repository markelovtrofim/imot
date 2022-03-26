import React, {FC} from 'react';
import IconButton from "../../../../components/IconButton";

type TimePropsType = {
  side: 'left' | 'right',
  value: number
};

const Time: FC<TimePropsType> = ({side, value}) => {
  const timeConverter = (s: number) => {
    const pad = (n: number) => {
      return ('00' + n).slice(-2);
    };
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    return `${pad(mins)}:${pad(secs)}`;
  };

  return (
    <IconButton
      margin={'12px 16px'}
      backgroundColor="#F8FAFC"
      width={"auto"}
      disabled
      icon={<div style={{color: side === 'left' ? '#A3AEBE' : '#738094'}}>{timeConverter(value)}</div>}
      onClick={(event: any) => {
        // пусто (пока).
      }}
    />
  );
};

export default Time;
