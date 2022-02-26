import React, {useEffect} from 'react';
import {Skeleton, Typography} from "@mui/material";
import {styled} from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, {AccordionProps} from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import {makeStyles} from "@mui/styles";
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tag from "../../components/Tag";
import Tooltip from '@mui/material/Tooltip';
import {CallsInfoType, CallsType, TagType} from "../../store/calls/calls.types";
import CallBody from "./CallBody";
import {useDispatch} from "react-redux";
import {getCallAudio} from "../../store/calls/calls.slice";


const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({theme}) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {},
  borderBottom: 0,
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

const CallSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M15.4696 1.03022C15.6103 1.17087 15.6893 1.36164 15.6893 1.56055V5.38897C15.6893 5.80319 15.3535 6.13897 14.9393 6.13897C14.5251 6.13897 14.1893 5.80319 14.1893 5.38897V3.37121L11.0303 6.53022C10.7374 6.82311 10.2625 6.82311 9.9696 6.53022C9.6768 6.23732 9.6768 5.76245 9.9696 5.46956L13.1287 2.31055H11.1109C10.6967 2.31055 10.3609 1.97476 10.3609 1.56055C10.3609 1.14633 10.6967 0.810547 11.1109 0.810547H14.9393C15.1382 0.810547 15.329 0.889567 15.4696 1.03022Z"
        fill="#73D13D"/>
      <path
        d="M1.00005 6.86077C2.91645 11.0346 6.32648 14.3531 10.566 16.1521L11.2456 16.4549C12.8004 17.1477 14.6282 16.6214 15.5765 15.2079L16.4646 13.8842C16.7533 13.4538 16.6654 12.8741 16.2621 12.5487L13.2502 10.1189C12.8078 9.76204 12.1573 9.84524 11.8189 10.3018L10.8872 11.5591C8.49637 10.3797 6.55528 8.43874 5.37595 6.04792L6.63317 5.1162C7.08987 4.77778 7.17298 4.12726 6.81608 3.68488L4.38622 0.672942C4.06087 0.269662 3.48137 0.181692 3.051 0.470262L1.71816 1.36396C0.295825 2.31766 -0.227555 4.16051 0.481175 5.71946L0.999265 6.85908L1.00005 6.86077Z"
        fill="#A3AEBE"/>
    </svg>
  )
}

const useStyles = makeStyles(({
  accordion: {
    backgroundColor: '#ffffff !important',
    borderTop: '2px solid #F8FAFC !important',
    padding: '0 24px !important',
    paddingTop: '18px !important',
    '& .MuiAccordionSummary-content': {
      margin: '0 !important',
    },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start !important',
    '& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': {
      margin: '25px !important',
      position: 'relative',
      fill: '#818D9F'
    },
  },
  slave: {
    position: 'absolute',
    top: '35px',
    right: '40px',
    borderRadius: '5px',
    width: '32px',
    height: '32px',
    backgroundColor: '#E3E8EF',
  },
  callInner: {},
  employee: {
    display: 'flex',
    alignItems: 'center'
  },
  employeeText: {
    marginRight: '20px !important'
  },
  callDateBox: {
    display: 'flex',
    marginTop: '8px'
  },
  callDate: {
    marginRight: '5px !important',
    color: '#738094 !important'
  },
  callTime: {
    color: '#738094 !important'
  },
  callDurationBox: {
    marginTop: '8px'
  },
  callDuration: {
    color: '#738094 !important'
  },
  callMNumberBox: {
    minWidth: '120px',
    paddingTop: '12px'
  },
  callMNumber: {
    fontSize: '15px !important'
  },
  callTags: {
    display: 'flex'
  },
  callTagsTitle: {
    color: '#738094 !important',
    minWidth: '120px'
  }
}));

const Call = ({call, callAudio, name, bundleIndex}: {callAudio: any, call: CallsInfoType | null, name: string | null, bundleIndex: number }) => {
  const classes = useStyles();

  function msToTime(s: number) {
    // Pad to 2 or 3 digits, default is 2
    function pad(n: any, z: any) {
      z = z || 2;
      return ('00' + n).slice(-z);
    }

    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;
    // @ts-ignore
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
  }

  const dispatch = useDispatch();
  const [callData, setCallData] = React.useState<{
    id: string | null,
    bundleIndex: number | null
  }>({
    id: null,
    bundleIndex: null
  });

  useEffect(() => {
    if (callData.id) {
      debugger
      // @ts-ignore
      dispatch(getCallAudio(callData));
    }
  }, [callData])
  console.log(callAudio)
  return (
    <Accordion style={{border: 'none '}} onClick={() => {
      debugger
      setCallData(
        // @ts-ignore
        {id: call.id, bundleIndex})
    }}>
      {/* Первичная информация о звонке. */}
      <AccordionSummary className={classes.accordion}>
        <Grid container className={classes.callInner}>
          {/* Сотрудник. */}
          <Grid item xs={1.8} style={{minWidth: '145px'}}>
            {/* Имя и фамилия. */}
            <div className={classes.employee}>
              <Typography className={classes.employeeText}>{call ? call.operatorPhone :
                <Skeleton width={60} height={20} variant="text"/>}</Typography>
              <CallSvg/>
            </div>
            {/* Дата звонка.*/}
            <div className={classes.callDateBox}>
              <Typography className={classes.callDate}>{call ? call.callTimeReadable :
                <Skeleton width={100} height={20} variant="text"/>}</Typography>
            </div>
            {/* Время звонка. */}
            <div className={classes.callDurationBox}>
              <Typography className={classes.callDuration}>
                {call ? msToTime(
                  // @ts-ignore
                  call.duration) : <Skeleton width={60} height={20} variant="text"/>}
              </Typography>
            </div>
          </Grid>
          {/* Клиент. */}
          <Grid item xs={1.5} className={classes.callMNumberBox}>
            {/* Номер телефона. */}
            <Typography className={classes.callMNumber}>{call ? call.clientPhone :
              <Skeleton style={{maxWidth: '100px'}} height={20} variant="text"/>}</Typography>
          </Grid>
          <Grid item xs={6.5}>
            <div className={classes.callTags}>
              <Typography className={classes.callTagsTitle}>Теги звонка</Typography>
              {call ?
                <Stack direction="row" style={{flexWrap: 'wrap', width: '200px !important'}}>
                  {// @ts-ignore
                    call.tags.map((tag: TagType) => {
                      const colorArray = [
                        {backgroundColor: "#FFCCC7", color: "#A8071A", hover: "#F9AEA7"},
                        {backgroundColor: "#D6E4FF", color: "#061178", hover: "#BED3FE"},
                        {backgroundColor: "#D9F7BE", color: "#237804", hover: "#9EEC5A"}
                      ]
                      const randomColor = () => {
                        const random = Math.floor(Math.random() * 3);
                        return colorArray[random];
                      }
                      const randomColorResult = randomColor()
                      return (
                        <Tooltip title={tag.value ? tag.value : 'пусто'} placement="top">
                          <div style={{margin: 0}}>
                            <Tag
                              label={tag.name}
                              backgroundColor={tag.color ? tag.color : randomColorResult.backgroundColor}
                              color={tag.color ? tag.color : randomColorResult.color}
                              hover={tag.color ? tag.color : randomColorResult.hover}
                            />
                          </div>
                        </Tooltip>)
                    })
                  }
                </Stack>
                : <div style={{width: '100%'}}>
                  <Skeleton style={{maxWidth: '500px', margin: '0 0 20px 10px'}} height={27}
                            variant="text"/>
                  <Skeleton style={{maxWidth: '500px', margin: '0 0 20px 10px'}} height={27} variant="text"/>
                </div>}
            </div>
            <div className={classes.slave}>
            </div>
          </Grid>
        </Grid>
      </AccordionSummary>
      {/* Основная информация о звонке. */}
      <AccordionDetails style={{backgroundColor: '#F8FAFC', border: 'none'}}>
        <CallBody/>
      </AccordionDetails>
    </Accordion>
  );
};

export default Call;