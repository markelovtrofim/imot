import React from 'react';
import {Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";

const Checklists = () => {
  const useStyles = makeStyles(({
  }));
  const classes = useStyles();

  return (
    <div>

      <Typography
        style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}}
        variant="h3"
      >
        Checklists
      </Typography>

    </div>
  );
};

export default Checklists;