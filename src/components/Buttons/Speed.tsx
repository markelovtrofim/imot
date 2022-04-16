import React, {FC, useState} from 'react';
import IconButton from "../IconButton";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(({
  speedUnit: {
    color: '#738094',
    fontWeight: '700'
  }
}));

const Speed: FC = () => {
  const classes = useStyles();
  const speedUnits = [
    '1x', '1.25x', '1.75x', '2x'
  ];
  const [currentSpeedUnit, setCurrentSpeedUnit] = useState<string>(speedUnits[0]);

  return (
    <IconButton
      margin={'0 15px 0 0'}
      width="auto"
      backgroundColor="#E3E8EF"
      icon={<div className={classes.speedUnit}>{currentSpeedUnit}</div>}
      onClick={(event: any) => {
        let index = speedUnits.indexOf(currentSpeedUnit) + 1;
        if (index > 3) {
          index = 0;
        }
        setCurrentSpeedUnit(speedUnits[index]);
      }}
    />
  );
};

export default Speed;
