import React from 'react';
import {InputBase, Typography} from "@mui/material";
import {BlockBox} from "../../../../components";
import Field from "../../../../components/FIeld";
import { makeStyles } from '@mui/styles';

const TagsDetail = () => {
  const useStyles = makeStyles(({
    tdNameAdnPriority: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
    },
    tdTagNameInput: {
      width: '100%'
    },
    tdPriorityInput: {
      '& input': {
        textAlign: 'center'
      }
    },
    typographyTitle: {
      color: '#2F3747 !important',
      fontWeight: '700 !important',
      fontSize: '16px !important',
      margin: '24px 0 19px 0 !important'
    }
  }))
  const classes = useStyles();

  return (
    <BlockBox padding={'5px 24px'}>
      <div className={classes.tdNameAdnPriority}>
        <Field label={"Название тега"} height={'45px'} width={"80%"} margin={'5%'}>
          <InputBase
            className={classes.tdTagNameInput}
            type="text"
          />
        </Field>
        <Field label={"Приоритет"} height={'45px'} width={'15%'}>
          <InputBase
            className={classes.tdPriorityInput}
            type="text"
          />
        </Field>
      </div>

      <div>
        <Typography className={classes.typographyTitle}>Глобальные настройки тега</Typography>
      </div>
      ...
    </BlockBox>
  );
};

export default TagsDetail;