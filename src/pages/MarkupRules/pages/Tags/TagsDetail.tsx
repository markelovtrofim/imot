import React from 'react';
import {Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {BlockBox} from "../../../../components";

const TagsDetail = () => {
  const useStyles = makeStyles(({
    // tt - tagsDetails

  }))
  const classes = useStyles()

  return (
    <BlockBox padding={'0 24px'}>
      <Typography
        style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)', paddingTop: '300px'}}
        variant="h3"
      >
        in this place will be tags details
      </Typography>
    </BlockBox>
  );
};

export default TagsDetail;