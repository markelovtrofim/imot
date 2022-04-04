import React from 'react';
import {Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {BlockBox} from "../../../../components";

const Tags = () => {
  const useStyles = makeStyles(({
    // tt - tagsDetails

  }))
  const classes = useStyles()

  return (
    <div>
      <Typography
        style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}}
        variant="h3"
      >
        Tags
      </Typography>
    </div>
  );
};

export default Tags;