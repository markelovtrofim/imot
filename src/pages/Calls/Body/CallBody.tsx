import React, {FC, useEffect, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {Typography} from "@mui/material";
import DialogItem from './DialogItem';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {callsSlice} from "../../../store/calls/calls.slice";
import {useDispatch} from "react-redux";
import {CallsInfoType} from "../../../store/calls/calls.types";
import PlayButton from "./Buttons/Play";
import Skip from "./Buttons/Skip";
import Speed from "./Buttons/Speed";
import Time from "./Buttons/Time";
import Volume from "../../../components/Volume";
import Plus from "./Buttons/Plus";
import Reboot from "./Buttons/Reboot";
import History from "./Buttons/History";
import Download from "./Buttons/Download";
import Back from "./Buttons/Back";
import {BlockBox} from "../../../components";
import ContainedSelect from "../../../components/Selects/ContainedSelect";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

type CallBodyPropsType = {
  callInfo: CallsInfoType,
  callAudio: string | null,
  callStt: any | null,
  bundleIndex: number,
  expanded: boolean,
};

const CallBody: FC<CallBodyPropsType> = React.memo(({callInfo, callAudio, callStt, bundleIndex, expanded}) => {
  const useStyles = makeStyles(({
    cbDialogWrapper: {
      height: '765px',
      width: '100%',
      backgroundColor: '#EEF2F6'
    },
    cbDialogInner: {
      padding: '12.5px 12px'
    },
    cbDialogItems: {
      overflowY: 'auto',
      height: '765px',
      '&::-webkit-scrollbar': {
        width: '4px',
        backgroundColor: 'f1f1f1',
        outline: 'none',

      },
      '&::-webkit-scrollbar-thumb': {
        background: '#A3AEBE',
        height: '50px',
        borderRadius: '10px'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#555'
      }
    },
    audioPlayer: {
      // overflow: 'hidden',
      // position: 'sticky',
      // top: `100px`,
      // zIndex: '101',
      // height: '250px',
      // backgroundColor: '#fff'
    },

    controlBlockButtonBox: {
      boxShadow: 'none !important',
      padding: '0 5px',
      marginLeft: '20px'
    },
    controlBlockButton: {
      border: 'none !important',
      transition: '0.4s !important',
      outline: 'none !important',
      height: '40px',
      fontSize: '14px !important',
      // @ts-ignore
      textTransform: 'none !important',
      color: '#738094 !important',
      backgroundColor: '#ffffff !important',
      '&.Mui-selected': {
        backgroundColor: '#D6D9DF !important',
        color: '#000 !important'
      }
    },
  }));
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!expanded && callAudio) {
      dispatch(callsSlice.actions.removeAudio({id: callInfo.id, bundleIndex}));
    }
  }, [expanded]);


  // test check list state.
  const checkListOptions = [
    {value: 'Чек лист 1', label: 'Чек лист 1'},
    {value: 'Чек лист 2', label: 'Чек лист 2'},
    {value: 'Чек лист 3', label: 'Чек лист 3'}
  ]
  const [checkListValue, setCheckListValue] = useState(checkListOptions[0]);

  const [alignment, setAlignment] = useState<string | null>('year');
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };


  return (
    <div>
      <div className={classes.audioPlayer}>
        <AudioPlayer
          style={{backgroundColor: '#F8FAFC', boxShadow: 'none'}}
          src={callAudio ? callAudio : ''}
        />
        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Volume/>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Time side={"left"} value={0}/>
            <Skip side={"left"}/>
            <PlayButton/>
            <Skip side={"right"}/>
            <Time side={"right"} value={1214000}/>
          </div>
          <div style={{width: '50px', marginRight: '15px'}}>
            <Speed/>
          </div>
        </div>

      </div>
      <div style={{display: 'flex'}}>
        <div className={classes.cbDialogWrapper}>
          <div className={classes.cbDialogInner}>
            <Typography style={{
              color: '#738094',
              fontSize: '14px',
              fontWeight: '700'
            }}>
              Текстовый диалог
            </Typography>
            <div className={classes.cbDialogItems}>
              {callStt && callStt.fragments.map((phrase: any) => {
                return (
                  <DialogItem person={phrase.direction} text={phrase.text}/>
                )
              })}
            </div>
          </div>
        </div>
        <div style={{backgroundColor: 'fff', width: '370px'}}>
          <div style={{display: 'flex', justifyContent: 'right'}}>
            <Plus/>
            <Reboot/>
            <History/>
            <Download/>
            <Back/>
          </div>

          {/* Params block*/}
          <BlockBox width={'auto'} height={'auto'} padding={'24px'} margin={'24px'}>
            <div style={{display: 'flex'}}>
              <Typography>Сотрудник:</Typography>
              <Typography>Имя Фамилия</Typography>
            </div>
            <div style={{display: 'flex'}}>
              <Typography>Клиент:</Typography>
              <Typography>79607807211</Typography>
            </div>
            <div style={{display: 'flex'}}>
              <Typography>Дата и время:</Typography>
              <div style={{display: 'flex'}}>
                <Typography>28/12/2021</Typography>
                <Typography>10:14</Typography>
              </div>
            </div>
          </BlockBox>

          {/* Check list block */}
          <BlockBox width={'auto'} height={'auto'} padding={'24px'} margin={'24px'}>
            <Typography>Чек лист</Typography>
            <ContainedSelect
              value={checkListValue}
              options={checkListOptions}
              onSelectChange={(event: any) => setCheckListValue(event)}
              width="274px"
            />

            <ToggleButtonGroup
              className={classes.controlBlockButtonBox}
              value={alignment}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton
                disabled={"today" === alignment}
                className={classes.controlBlockButton} value="today"
                onClick={() => {
                }}
              >
                1
              </ToggleButton>

              <ToggleButton disabled={"yesterday" === alignment}
                            className={classes.controlBlockButton} value="yesterday"
                            onClick={() => {
                            }}
              >
                2
              </ToggleButton>

              <ToggleButton
                className={classes.controlBlockButton} disabled={"week" === alignment} value="week"
                onClick={() => {
                }}
              >
                3
              </ToggleButton>

              <ToggleButton
                className={classes.controlBlockButton} disabled={"month" === alignment} value="month"
                onClick={() => {
                }}
              >
                4
              </ToggleButton>

              <ToggleButton
                className={classes.controlBlockButton} disabled={"year" === alignment} value="year"
                onClick={() => {
                }}
              >
                5
              </ToggleButton>
            </ToggleButtonGroup>
          </BlockBox>

          {/* Comments input */}
          <BlockBox width={'auto'} height={'auto'} padding={'24px'} margin={'24px'}>
            Params block
          </BlockBox>

        </div>
      </div>
    </div>
  );
});


export default CallBody;