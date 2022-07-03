import React from 'react';
import {makeStyles} from '@mui/styles';
import {useAppSelector} from '../../../hooks/redux';
import {Typography, Button} from "@mui/material";
import {translate} from "../../../localizations";
import {RootState} from "../../../store/store";
import TextSelect from '../Selects/TextSelect/TextSelect';

const useStyles = makeStyles(({
  criteriaTemplateTitle: {
    marginTop: '3px',
    borderLeft: '1px solid #CDD5DF', 
    paddingLeft: '16px'
  },
  criteriaTemplateText: {
    fontFamily: '"Inter", sans-serif',
    display: 'flex', 
    fontSize: '16px', 
    lineHeight: '24px', 
    color: '#2F3747', 
    marginRight: '5px'
  },
  criteriaTemplateTextNumber: {
    fontSize: '16px', 
    lineHeight: '24px', 
    marginRight: '3px', 
    color: '#2F3747'
  }
}));

const CriteriaTemplate = (props: any) => {
  const {language} = useAppSelector((state: RootState) => state.lang);
  const classes = useStyles();

  return (
    <div className={classes.criteriaTemplateTitle}>
    <TextSelect
        name={'templatesSelect'}
        value={props.currentTemplate ? {value: props.currentTemplate, label: props.currentTemplate.title} : null}
        handleValueChange={props.handleValueChange}
        options={props.options}
        iconPosition={'right'}
        customControl={
          <div className={classes.criteriaTemplateText}>
            {props.currentTemplate ?
              <>
                <Typography style={{color: '#722ED1'}}>{props.currentTemplate.title}</Typography>
              </> :
              <>
                <Typography className={classes.criteriaTemplateTextNumber}>{translate('searchTemp', language)}</Typography>
                <span>({props.allTemplates.length})</span>
              </>
            }
          </div>
        }
        ifArrowColor={props.currentTemplate ? '#722ED1' : '#000'}
        menuPosition={'left'}
      />
    </div>
  )
}

export default CriteriaTemplate;