import React, {FC, useEffect, useRef, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {Typography} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import {callsSlice} from "../../../store/calls/calls.slice";
import {useDispatch} from "react-redux";
import {
  CallAudioType,
  CallInfoType,
  CallSttType,
} from "../../../store/calls/calls.types";
import PlayButton from "../../../components/Buttons/Play";
import Skip from "../../../components/Buttons/Skip";
import Speed from "../../../components/Buttons/Speed";
import Time from "../../../components/Buttons/Time";
import Volume from "../../../components/Volume";
import Plus from "../../../components/Buttons/Plus";
import Reboot from "../../../components/Buttons/Reboot";
import History from "../../../components/Buttons/History";
import Download from "../../../components/Buttons/Download";
import Back from "../../../components/Buttons/Back";
import {BlockBox} from "../../../components";
import ContainedSelect from "../../../components/Selects/ContainedSelect";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

import ReactAudioPlayer from 'react-audio-player';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

type CallBodyPropsType = {
  callInfo: CallInfoType,
  callAudio: CallAudioType | null,
  callStt: CallSttType | null,
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
    isActive: {
      backgroundColor: 'black'
    },
    test: {

    }
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
  ];
  const [checkListValue, setCheckListValue] = useState(checkListOptions[0]);
  const [alignment, setAlignment] = useState<string | null>('year');
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  // почитать про:
  // useCallback
  // useMemo
  // memo

  const currentTime = useRef(0);
  const callId = callInfo.id;

  const prevIndex = useRef<string[] | undefined | null>(undefined);
  const currentIndex = useRef<string[] | undefined | null>(undefined);

  useEffect(() => {
    return () => {
      currentTime.current = 0;
      prevIndex.current = undefined;
      currentIndex.current = undefined;
    }
  })

  const getIndices = (array: Array<any>, necessaryElements: any) => {
    let indices: number[] = []
    for (let i = 0; i < necessaryElements.length; i++) {
      indices.push(array.indexOf(necessaryElements[i]));
    }
    return indices;
  }

  // Возвращает строку с индексом фрагмента/фразы и слова.
  function findWordIndex(phrases: any[] | undefined, currentTime: number) {
    if (phrases) {
      const currentFragments = phrases.filter(phrase => phrase.begin <= currentTime && currentTime <= phrase.end);
      const currentFragmentsIndices = getIndices(phrases, currentFragments);

      if (currentFragmentsIndices.length < 1 || currentFragmentsIndices.some(index => index < 0)) {
        return undefined;
      }

      let indices = []
      for (let i = 0; i < currentFragments.length; i++) {
        const currentWords = currentFragments[i].words.filter((word: any) => word.begin <= currentTime && currentTime <= word.end);
        const currentWordsIndices = getIndices(currentFragments[i].words, currentWords);

        for (let j = 0; j < currentWords.length; j++) {
          indices.push(`${callId}-${currentFragmentsIndices[i]}-${currentWordsIndices[j]}`)
        }
      }
      if (indices.length < 1) {
        return undefined;
      }
      return indices;
    }
  } // return [1-4, 2-8]


  const onListen = (eventCurrentTime: any) => {
    let currentTimeLocal;
    if (!!eventCurrentTime.target) {
      currentTimeLocal = eventCurrentTime.target.currentTime * 1000;
    } else {
      currentTimeLocal = eventCurrentTime * 1000;
    }

    currentTime.current = currentTimeLocal;
    if (callStt) {
      const indices = findWordIndex(callStt.fragments, currentTimeLocal);

      if (indices && JSON.stringify(indices) !== JSON.stringify(prevIndex.current)) {

        let activeWord = null;
        for (let i = 0; i < indices.length; i++) {
          activeWord = document.getElementById(`${indices[i]}`);
          if (activeWord) {
            activeWord.classList.add(classes.isActive);
          }
        }

        if (prevIndex.current) {
          for (let i = 0; i < prevIndex.current.length; i++) {
            // убираем раскраску с предыдущего
            const removeElement = document.getElementById(`${prevIndex.current[i]}`);
            if (removeElement) {
              removeElement.classList.remove(classes.isActive)
            }
          }
        }

        // новоепредыдущее = текущее
        prevIndex.current = indices;

        // if (activeWord) {
        //   activeWord.scrollIntoView({
        //     behavior: "smooth",
        //   });
        // }

      }
      if (!indices) {
        // убираем раскраску с предыдущего
        const removeElement = document.getElementById(`${prevIndex.current}`);
        if (removeElement) {
          removeElement.classList.remove(classes.isActive)
        }
      }
      currentIndex.current = indices;
    }
    // const activeWordPosition = item.getBoundingClientRect();
    // activeWord.scrollTo({
    // x: activeWordPosition.x
    // y: activeWordPosition.y - 100
    // })
  };

  return (
    <div>
      <div className={classes.audioPlayer} onClick={onListen}>
        <ReactAudioPlayer
          style={{width: '100%'}}
          src={callAudio ? callAudio : ''}
          controls={true}
          listenInterval={1}
          onListen={onListen}
          onSeeked={onListen}
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
              <ul>
                {callStt ?
                  callStt.fragments.map((fragment, i) => (
                    <li key={i}>
                      {fragment.words.map((word, j) => (
                        <span
                          id={`${callId}-${i}-${j}`}
                          className={classes.test}
                          key={j}
                        >
                          {word.word}{" "}
                        </span>
                      ))}
                    </li>
                  )) :
                  <Typography variant={'h3'}>Скоро придет</Typography>}
              </ul>

              {/*{callStt && callStt.fragments.map((phrase: any, i: number) => {*/}
              {/*  return (*/}
              {/*    <DialogItem*/}
              {/*      key={phrase.id}*/}
              {/*      currentTime={currentTime}*/}
              {/*      person={phrase.direction}*/}
              {/*      phrase={phrase}*/}
              {/*    />*/}
              {/*  )*/}
              {/*})}*/}
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
              onSelectChange={(event: any) => {
                setCheckListValue(event)
              }}
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