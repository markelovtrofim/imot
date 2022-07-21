import React, {memo, useEffect, useRef, useState} from 'react';
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
import {TwoTags, Fragment} from "../../components/common/Tag";
import {CallInfoType, CallTagType} from "../../store/calls/calls.types";
import CallBody from "./Body/CallBody";
import {useDispatch} from "react-redux";
import {callsSlice} from "../../store/calls/calls.slice";
import {useAppSelector} from "../../hooks/redux";
import {RootState} from "../../store/store";
import {translate} from "../../localizations";
import CustomCheckbox from "../../components/common/Checkbox";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion
    disableGutters
    TransitionProps={{unmountOnExit: true, timeout: 0}}
    elevation={0} {...props}
  />
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
    expandIcon={
      <span style={{
        borderRadius: '5px',
        width: '32px',
        height: '32px',
        backgroundColor: '#E3E8EF',
        cursor: "pointer"
      }}>
        <ArrowForwardIosSharpIcon style={{fontSize: '0.9rem', margin: "5px"}}/>
      </span>
    } {...props}
  />
))(({theme}) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  '& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': {
    margin: "9px !important"
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
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
  );
};

type CallStubMiddlewarePropsType = {
  callInfo: CallInfoType | null,
  expanded: boolean,
  solo?: boolean,
};



const CallStubMiddleware = memo((
  {
    callInfo,
    expanded,
    solo
  }: CallStubMiddlewarePropsType) => {
  const useStyles = makeStyles(({
    accordion: {
      backgroundColor: '#ffffff !important',
      borderTop: '2px solid #F8FAFC !important',
      padding: '18px 24px 10px 24px !important',
      cursor: 'default !important',
      '& .MuiAccordionSummary-content': {
        margin: '0 !important',
      },
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start !important',
      '& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': {
        margin: '25px !important',
        position: 'relative',
        fill: '#818D9F',
        transform: 'rotate(90deg)',
        cursor: 'pointer'
      },
      '&.Mui-disabled': {
        opacity: '1 !important'
      }
    },
    callInner: {},
    employee: {
      display: 'flex',
      alignItems: 'center'
    },
    employeeText: {
      marginRight: '20px !important',
      minWidth: '40px !important'
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
    },
    callMNumber: {
      fontSize: '15px !important'
    },
    callTagsTitle: {
      color: '#738094 !important',
      minWidth: '120px',
      fontSize: '12px !important',
    },
    accordionDetails: {
      backgroundColor: '#F8FAFC',
      border: 'none',
    },
    '@media (width: 1024px)': {
      callInner: {
        display: 'block',
      }
    }
  }));

  const classes = useStyles()

  // Заглушки пока не пришли звонки с сервака.
  if (!callInfo) {
    return (
      <Accordion style={{border: 'none', zIndex: '1'}}>
        {/* Первичная информация о звонке. */}
        <AccordionSummary className={classes.accordion} disabled>
          <Grid container className={classes.callInner}>
            <div style={{textAlign: 'center', margin: '12px 12px 0 0'}}>
              <CustomCheckbox
                checked={false}
                onChange={() => {
                }}
              />
            </div>

            {/* Сотрудник. */}
            <Grid item xs={1.8} style={{minWidth: '145px'}}>
              {/* Имя и фамилия. */}
              <div className={classes.employee}>
                <Skeleton width={108} height={20} variant="text"/>
                <CallSvg style={{marginLeft: '35px'}}/>
              </div>
              {/* Дата звонка.*/}
              <div className={classes.callDateBox}>
                <Skeleton width={147} height={20} variant="text"/>
              </div>
            </Grid>

            {/* Клиент. */}
            <Grid item xs={1.5} className={classes.callMNumberBox}>
              {/* Номер телефона. */}
              <Skeleton style={{maxWidth: '100px'}} width={108} height={20} variant="text"/>
              {/* Время звонка. */}
              <div className={classes.callDurationBox}>
                <Skeleton width={147} height={20} variant="text"/>
              </div>
            </Grid>

            <Grid item xs={6.7}>

              {/* Теги */}
              <div style={{display: 'flex'}}>
                <Typography className={classes.callTagsTitle}>Теги звонка</Typography>
                <div style={{width: '100%'}}>
                  <Skeleton style={{maxWidth: '500px', margin: '0 0 10px 10px'}} height={20} variant="text"/>
                </div>
              </div>

              {/* Фрагменты */}
              <div style={{display: 'flex'}}>
                <Typography className={classes.callTagsTitle}>Теги фрагмента</Typography>
                <div style={{width: '100%'}}>
                  <Skeleton style={{maxWidth: '500px', margin: '0 0 20px 10px'}} height={20} variant="text"/>
                </div>
              </div>
            </Grid>

          </Grid>
        </AccordionSummary>
      </Accordion>
    );
  }
  return (
    <Call
      callInfo={callInfo}
      expanded={expanded}
      solo={solo}
    />
  )
});


type CallPropsType = {
  callInfo: CallInfoType,
  expanded: boolean,

  solo?: boolean,
};

// конвертирует время для показа
export const timeConverter = (s: number, hoursIsDisplay: boolean) => {
  const pad = (n: number) => {
    return ('00' + n).slice(-2);
  };
  let ms = s % 1000;
  s = (s - ms) / 1000;
  let secs = s % 60;
  s = (s - secs) / 60;
  let mins = s % 60;
  let hrs = (s - mins) / 60;
  if (hoursIsDisplay) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
};

function areEqual(prevProps: CallPropsType, nextProps: CallPropsType) {
  return prevProps.expanded === nextProps.expanded;
}

const Call = memo((props: CallPropsType) => {
  const useStyles = makeStyles(({
    accordion: {
      border: 'none !important',
      zIndex: '1 !important'
    },
    accordionSummary: {
      // @ts-ignore
      position: `sticky !important`,
      top: '0 !important',
      // @ts-ignore
      userSelect: 'auto !important',
      zIndex: '100 !important',
      backgroundColor: '#ffffff !important',
      borderTop: '2px solid #F8FAFC !important',
      padding: '18px 24px 10px 24px !important',
      cursor: 'default !important',
      '& .MuiAccordionSummary-content': {
        margin: '0 !important',
      },
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start !important',
      '& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': {
        margin: '25px !important',
        position: 'relative',
        fill: '#818D9F',
        transform: 'rotate(90deg)',
        cursor: 'pointer'
      },
      '&.Mui-disabled': {
        opacity: '1 !important'
      }
    },
    slave: {
      position: 'absolute',
      top: '35px',
      right: '40px',
      borderRadius: '5px',
      width: '32px',
      height: '32px',
      backgroundColor: '#E3E8EF',
      "&:hover": {
        backgroundColor: '#D6D9DF'
      }
    },
    callInner: {
      width: "100%",
      display: 'flex',
      ['@media (max-width:1024px)']: { // eslint-disable-line no-useless-computed-key
        display: 'block',
      }
    },
    callEmAndCl: {
      display: 'flex'
    },
    employee: {
      minWidth: '200px',
      display: 'flex',
      alignItems: 'center',
    },
    employeeText: {
      fontSize: '14px !important',
      marginRight: '20px !important',
      minWidth: '40px !important'
    },
    tagsAndFragmentsBlock: {
      ['@media (max-width:1024px)']: { // eslint-disable-line no-useless-computed-key
        marginTop: '10px'
      }
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
      fontSize: '13px !important',
      color: '#738094 !important'
    },
    callDurationBox: {
      display: 'flex',
      marginTop: '8px'
    },
    callDuration: {
      fontSize: '14px !important',
      color: '#738094 !important'
    },
    callMNumberBox: {
      minWidth: '200px',
    },
    callMNumber: {
      fontSize: '14px !important'
    },
    callTagsTitle: {
      color: '#738094 !important',
      minWidth: '120px',
      fontSize: '12px !important',
    },
    accordionDetails: {
      backgroundColor: '#F8FAFC',
      border: 'none',
      margin: '0px !important'
    },
    typographyTitle: {
      fontSize: '14px !important',
      color: '#2F3747 !important',
      fontWeight: '700 !important',
      marginRight: '5px !important'
    },
    activeFragment: {
      backgroundColor: '#F5F5DC'
    }
  }));

  const classes = useStyles();
  const dispatch = useDispatch();

  const {language} = useAppSelector((state: RootState) => state.lang);
  const selectedCalls = useAppSelector(state => state.calls.selectedCalls);

  // разделяет теги на теги и фрагменты
  const tagsAndFragmentsSeparator = () => {
    let tags = [];
    let fragments = [];
    for (let i = 0; i < props.callInfo.tags?.length; i++) {

      // if (props.callInfo.tags[i].tagType === 'api_callback') {
      //   clientTags.push(props.callInfo.tags[i]);
      // }{

      if (props.callInfo.tags[i].fragment) {
        fragments.push(props.callInfo.tags[i]);
      } else {
        tags.push(props.callInfo.tags[i]);
      }

    }
    return {tags, fragments};
  };
  const tagsAndFragmentsArray = tagsAndFragmentsSeparator();

  const scroll = (currentTarget: any) => {
    if (currentTarget) {
      const topValue = window.pageYOffset + currentTarget.getBoundingClientRect().top - 10;
      window.scrollTo({
        top: topValue,
        behavior: "smooth"
      });
    }
  }

  const accordionSummary = useRef<any | null>(null);
  const audioRef = useRef<any | null>(null);

  useEffect(() => {
    function onResize() {
      if (accordionSummary.current && audioRef.current) {
        audioRef.current.style.top = `${accordionSummary.current.offsetHeight}px`;
      }
    }

    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.addEventListener('resize', onResize)
    }
  });

  const checked = selectedCalls.length > 0 && selectedCalls.find(selectedCall => {
    return selectedCall.callId === props.callInfo.id.toUpperCase();
  })

  const expandedId = useAppSelector(state => state.calls.expandedId);

  const [test, setTest] = useState(null);

  return (
    <Accordion
      id={props.callInfo.id}
      className={classes.accordion}
      tabIndex={-1}
      expanded={props.expanded}
    >
      {/* Первичная информация о звонке. */}
      <div style={{position: 'sticky', top: '0', zIndex: '101'}} ref={accordionSummary}>
        <AccordionSummary
          id={'accordionSummary'}
          className={classes.accordionSummary} tabIndex={-1}
        >
          <div style={{textAlign: 'center', margin: '12px 12px 0 0'}}>
            <CustomCheckbox
              checked={checked && (checked.callId === props.callInfo.id.toUpperCase())}
              onChange={(event) => {
                if (event.currentTarget.checked) {
                  dispatch(callsSlice.actions.pushSelectedCall({
                    callId: props.callInfo.id,
                  }));
                } else {
                  dispatch(callsSlice.actions.removeSelectedCall({
                    callId: props.callInfo.id,
                  }));
                }
              }}
            />
          </div>
          <div className={classes.callInner} onClick={async (e) => {
            if (!props.expanded) {
              scroll(e.target);
            }
            dispatch(callsSlice.actions.setExpanded({id: expandedId, value: false}));
            dispatch(callsSlice.actions.setExpanded({id: props.callInfo.id, value: !props.expanded}));
          }}>
            <div className={classes.callEmAndCl}>
              {/* Сотрудник. */}
              <div>

                {/* Имя и фамилия. */}
                <div className={classes.employee}>
                  <Typography className={classes.typographyTitle}>{translate("callsEmployee", language)}:</Typography>
                  <Typography className={classes.employeeText}>
                    {props.callInfo.operatorPhone}
                  </Typography>
                  <CallSvg/>
                </div>

                {/* Дата звонка.*/}
                <div className={classes.callDateBox}>
                  <Typography className={classes.typographyTitle}>{translate("callsTime", language)}:</Typography>
                  <Typography className={classes.callDate}>
                    {props.callInfo.callTimeReadable}
                  </Typography>
                </div>

                {/*<div>*/}
                {/*  {tagsAndFragmentsArray.clientTags.map(tag => {*/}
                {/*    return (*/}
                {/*      <div style={{margin: 0, display: 'flex'}}>*/}
                {/*        <TwoTagsMini title={tag.name} body={tag.value}/>*/}
                {/*      </div>*/}
                {/*    )*/}
                {/*  })}*/}
                {/*</div>*/}

              </div>

              {/* Клиент. */}
              <div className={classes.callMNumberBox}>
                {/* Номер телефона. */}
                <div style={{display: 'flex'}}>
                  <Typography className={classes.typographyTitle}>{translate("callsCustomer", language)}:</Typography>
                  <Typography className={classes.callMNumber}>
                    {props.callInfo.clientPhone}
                  </Typography>
                </div>

                {/* Время звонка. */}
                <div className={classes.callDurationBox}>
                  <Typography className={classes.typographyTitle}>{translate("callsDuration", language)}:</Typography>
                  <Typography className={classes.callDuration}>
                    {timeConverter(props.callInfo.duration, true)}
                  </Typography>
                </div>
              </div>
            </div>
            <div className={classes.tagsAndFragmentsBlock}>
              {/* Tags */}
              <div style={{display: 'flex'}}>
                <Typography className={classes.callTagsTitle}>{translate("callsTags", language)}</Typography>
                <Stack direction="row" style={{flexWrap: 'wrap', width: '200px !important'}}>
                  {tagsAndFragmentsArray.tags.map((tag: CallTagType) => {
                    return (
                      <div style={{margin: 0, display: 'flex'}}>
                        <TwoTags title={tag.name} body={tag.value}/>
                      </div>
                    )
                  })}
                </Stack>
              </div>

              {/* Fragments */}
              {tagsAndFragmentsArray.fragments.length > 0 &&
              <div style={{display: 'flex'}}>
                <Typography className={classes.callTagsTitle}>{translate("callsFragments", language)}</Typography>
                <Stack direction="row" style={{flexWrap: 'wrap', width: '200px !important'}}>

                  {tagsAndFragmentsArray.fragments.map((tag: CallTagType) => {
                    return (
                      <div
                        onClick={async (event) => {
                          if (!props.expanded) {
                            dispatch(callsSlice.actions.setExpanded({id: props.callInfo.id, value: true}));
                          } else {
                            event.stopPropagation();
                          }
                          // @ts-ignore
                          setTest(tag);
                        }}
                      >
                        <Fragment matchData={tag.matchData}>{tag.name}</Fragment>
                      </div>
                    )
                  })}
                </Stack>
              </div>}

            </div>
          </div>

        </AccordionSummary>
      </div>
      {/* Основная информация о звонке. */}
      <AccordionDetails className={classes.accordionDetails}>
        <CallBody
          callInfo={props.callInfo}
          fragments={tagsAndFragmentsArray.fragments}
          expanded={props.expanded}
          audioDivRef={audioRef}

          test={test}
        />
      </AccordionDetails>
    </Accordion>
  );
}, areEqual);

export default CallStubMiddleware;
