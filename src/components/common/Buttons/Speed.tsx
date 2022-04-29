import React, {FC, useEffect, useState} from 'react';
import IconButton from "../IconButton";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(({
  speedUnit: {
    color: '#738094',
    fontWeight: '700'
  }
}));

const Speed: FC<{audioPlayerRef: any}> = ({audioPlayerRef}) => {
  const classes = useStyles();

  const speedChanger = (speed: number) => {
    audioPlayerRef.current.audioEl.current.playbackRate = speed;
  }

  const speedUnits = [
    0.5, 1, 1.5, 2
  ];
  const [currentSpeedUnit, setCurrentSpeedUnit] = useState<number>(speedUnits[1]);

  useEffect(() => {
    return () => {
      setCurrentSpeedUnit(speedUnits[1]);
    }
  })

  return (
    <IconButton
      margin={'0 15px 0 0'}
      width="auto"
      backgroundColor="#E3E8EF"
      icon={<div className={classes.speedUnit}>{currentSpeedUnit}</div>}
      onClick={() => {
        let speedIndex = speedUnits.indexOf(currentSpeedUnit) + 1;
        if (speedIndex > 3) {
          speedIndex = 0;
        }
        speedChanger(speedUnits[speedIndex]);
        setCurrentSpeedUnit(speedUnits[speedIndex]);
      }}
    />
  );
};

export default Speed;
