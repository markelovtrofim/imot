import React, {FC} from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

type LinearDeterminatePropsType = {
  progressIsOver: boolean
}

const LinearDeterminate: FC<LinearDeterminatePropsType> = ({progressIsOver}) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (progressIsOver) {
        setProgress(100);
        clearInterval(timer);
      }

      setProgress((oldProgress) => {
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 250);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}

export default LinearDeterminate;
