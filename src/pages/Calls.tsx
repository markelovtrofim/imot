import React from 'react';
import {ControlBlock} from "../components";
import Filter from "../components/Filter";
import {Typography} from "@mui/material";
import {BlockBox} from "../components/BlockBox";
import {styled} from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, {AccordionProps} from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import {makeStyles} from "@mui/styles";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({theme}) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>}
    {...props}
  />
))(({theme}) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const useStyles = makeStyles(({
  employee: {

  }
}));

const Calls = () => {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const classes = useStyles();

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  return (
    <div>
      <ControlBlock/>
      <Filter pageName="Звонок"/>
      <BlockBox padding="24px">
        <div>
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">

              <div className={classes.employee}>
                <div>
                  Сотрудник
                </div>
              </div>

            </AccordionSummary>
            <AccordionDetails>
              <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}}>Calls body #1</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
              <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}}>Calls Item #2</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}}>Calls body #2</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
              <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}}>Calls Item #3</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography style={{textAlign: 'center', color: 'rgba(0, 0, 0, 0.2)'}}>Calls body #3</Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </BlockBox>
    </div>
  )
}

export default Calls;