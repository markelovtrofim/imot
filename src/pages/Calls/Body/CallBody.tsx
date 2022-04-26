import React, {Dispatch, FC, useEffect, useRef, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {Typography} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import {callsSlice} from "../../../store/calls/calls.slice";
import {useDispatch} from "react-redux";
import {
  CallAudioType,
  CallInfoType,
  CallSttFragmentType,
  CallSttType,
  TagType,
} from "../../../store/calls/calls.types";
import Plus from "../../../components/Buttons/Plus";
import Reboot from "../../../components/Buttons/Reboot";
import History from "../../../components/Buttons/History";
import Download from "../../../components/Buttons/Download";
import Back from "../../../components/Buttons/Back";
import {BlockBox} from "../../../components";
import {BaseTag, Fragment} from "../../../components/Tag";
import AudioPlayer from "../../../components/AudioPlayer";
import DialogItem from "./DialogItem";

type CallBodyPropsType = {
  callInfo: CallInfoType,
  callAudio: CallAudioType | null,
  callStt: CallSttType | null,
  bundleIndex: number,
  expanded: boolean,
  fragments: TagType[],
  audioRef: any,
  onFragmentClick: any,
  prevActiveFragment: any,
  audioPlayerRef: any,
  activeFragmentRef: any
};

const CallBody: FC<CallBodyPropsType> = React.memo(({
                                                      callInfo,
                                                      callAudio,
                                                      callStt,
                                                      fragments,
                                                      bundleIndex,
                                                      expanded,
                                                      audioRef,
                                                      onFragmentClick,
                                                      audioPlayerRef,
                                                      prevActiveFragment,
                                                      activeFragmentRef
                                                    }) => {
  const useStyles = makeStyles(({
    callBodyWrapper: {},
    cbDialogWrapper: {
      borderRadius: '5px',
      height: '100%',
      width: '100%',
      backgroundColor: '#EEF2F6',
      overflow: 'hidden'
    },
    cbDialogInner: {
      padding: '12.5px 12px'
    },
    cbDialogItems: {
      overflowY: 'auto',
      padding: '5px 0',
      height: '800px',
      '&::-webkit-scrollbar': {
        width: '4px',
        height: '4px',
        backgroundColor: '#f1f1f1',
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
    audioPlayerBox: {
      overflow: 'hidden',
      position: 'sticky',
      top: '-200px',
      zIndex: '100'
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
      backgroundColor: '#CDD5DF',
      color: '#000'
    },
    typographyTitle: {
      color: '#738094 !important',
      fontWeight: '700 !important',
      minWidth: '110px !important',
    },
    activeFragment: {
      backgroundColor: '#F5F5DC'
    }
  }));
  const classes = useStyles();
  const dispatch = useDispatch();


  useEffect(() => {
    if (!expanded && callAudio) {
      dispatch(callsSlice.actions.removeAudio({id: callInfo.id, bundleIndex}));
    }
  }, [expanded]);

  const callId = callInfo.id;

  const prevIndex = useRef<string[] | undefined>(undefined);
  const currentIndex = useRef<string[] | undefined>(undefined);

  const getIndices = (array: Array<any>, necessaryElements: any) => {
    let indices: number[] = []
    for (let i = 0; i < necessaryElements.length; i++) {
      indices.push(array.indexOf(necessaryElements[i]));
    }
    return indices;
  }

  // Возвращает строку с индексом фрагмента/фразы и слова.
  function findWordIndexes(phrases: any[] | undefined, currentTime: number) {
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
    if (callStt) {
      const indices = findWordIndexes(callStt.fragments, currentTimeLocal);

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
  }

  return (
    <div className={classes.callBodyWrapper}>
      <div ref={audioRef} className={classes.audioPlayerBox}>
        <AudioPlayer
          onListen={onListen}
          callAudio={callAudio}
          audioPlayerRef={audioPlayerRef}
        />
      </div>
      <div style={{display: 'flex'}}>
        <div className={classes.cbDialogWrapper}>
          <div className={classes.cbDialogInner}>
            {fragments.length > 0 &&
            <>
              <Typography style={{marginBottom: '10px'}} className={classes.typographyTitle}>
                Теги:
              </Typography>
              <div style={{display: 'flex', marginBottom: '15px'}}>
                {fragments.map((fragment) => (
                  <div
                    onClick={(event: any) => {
                      onFragmentClick(fragment);
                    }}
                  >
                    <Fragment matchData={fragment.matchData}>
                      {fragment.name}
                    </Fragment>
                  </div>
                ))}
              </div>
            </>
            }
            <Typography style={{marginBottom: '10px'}} className={classes.typographyTitle}>
              Текстовый диалог:
            </Typography>
            <div className={classes.cbDialogItems} id={callId}>
              {callStt ?
                <div>
                  {callStt.fragments.map((phrase, i, array) => {
                    return (
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                           id={`${phrase.id}-phrase`}>
                        <div style={{width: '85%'}}>
                          <DialogItem
                            audioPlayerRef={audioPlayerRef}
                            prevFragment={array[i - 1] ? array[i - 1] : {direction: phrase.direction === 'client' ? 'operator' : 'client'}}
                            fragment={phrase}
                            callId={callId}
                            fragmentIndex={i}
                          />
                        </div>
                        <div style={{textAlign: 'center', width: '15%'}}>
                          {fragments.map((fragment, j) => {
                            if (phrase.begin === fragment.fBegin && phrase.end === fragment.fEnd) {
                              return <div>
                                <Fragment matchData={fragment.matchData}>{fragment.name}</Fragment>
                              </div>;
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div> : null
              }
            </div>
          </div>
        </div>
        <div style={{backgroundColor: 'fff', width: '370px', marginTop: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Back/>
            <Download/>
            <History/>
            <Reboot/>
            <Plus margin={'0'}/>
          </div>

          {/* Params block*/}
          <BlockBox width={'auto'} height={'auto'} padding={'24px'} margin={'24px 14px 24px 24px'}>
            <div style={{display: 'flex'}}>
              <Typography className={classes.typographyTitle}>Сотрудник:</Typography>
              <Typography>{callInfo.operatorPhone}</Typography>
            </div>
            <div style={{display: 'flex'}}>
              <Typography className={classes.typographyTitle}>Клиент:</Typography>
              <Typography>{callInfo.clientPhone}</Typography>
            </div>
            <div style={{display: 'flex'}}>
              <Typography className={classes.typographyTitle}>Дата и время:</Typography>
              <Typography>{callInfo.callTimeReadable}</Typography>
            </div>
          </BlockBox>

        </div>
      </div>
    </div>
  );
});


export default CallBody;