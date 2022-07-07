import React from 'react';
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { BlockBox } from "../../../components/common";

const ChecklistsDetail = () => {
  const useStyles = makeStyles(({
  }));
  const classes = useStyles();

  return (
    <BlockBox padding={'0 15px'} width={'100%'}>

      <Typography
        style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)', paddingTop: '300px' }}
        variant="h3"
      >
        in this place will be checklists details
      </Typography>

    </BlockBox>
  );
};

export default ChecklistsDetail;