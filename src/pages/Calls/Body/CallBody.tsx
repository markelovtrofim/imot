import React, {FC, useEffect, useRef, useContext, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {CircularProgress, Tooltip, Typography} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import {callAction, callsSlice, getCallInfo, getCallPublicToken, getCallStt} from "../../../store/calls/calls.slice";
import {useDispatch} from "react-redux";
import {
  CallAudioType,
  CallInfoType,
  CallSttType,
  CallTagType,
} from "../../../store/calls/calls.types";
import Reboot from "../../../components/common/Buttons/Reboot";
import Download from "../../../components/common/Buttons/Download";
import Back from "../../../components/common/Buttons/Back";
import {BlockBox} from "../../../components/common";
import {Fragment} from "../../../components/common/Tag";
import AudioPlayer from "../../../components/common/AudioPlayer";
import DialogItem from "./DialogItem";
import {useAppSelector} from "../../../hooks/redux";
import CustomControlSelect from "../../../components/common/Selects/CustomControlSelect";
import {translate} from "../../../localizations";
import {SnackbarContext} from "../../../App";
import ModalWindow from "../../../components/common/ModalWindowBox";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import CustomCheckbox from "../../../components/common/Checkbox";
import History from "../../../components/common/Buttons/History";
import {LoadingButton} from "@mui/lab";
import Logo from "../../../assets/images/logo.png";
import Yandex from "../../../assets/images/yandex_PNG20.png";
import {langSlice} from "../../../store/lang/lang.slice";


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

type CallBodyPropsType = {
  callInfo: CallInfoType,
  callAudio: CallAudioType | null,
  callStt: CallSttType | null,
  bundleIndex: number | null,
  expanded: boolean,
  fragments: CallTagType[],

  // сори)
  audioRef: any,
  onFragmentClick: any,
  prevActiveFragment: any,
  audioPlayerRef: any,
  activeFragmentRef: any,
  setIsCallBodyData: any
};

const CallBody: FC<CallBodyPropsType> = React.memo((
  {
    callInfo,
    callAudio,
    callStt,
    fragments,
    bundleIndex,
    expanded,
    audioRef,
    onFragmentClick,
    audioPlayerRef,
    setIsCallBodyData,

    prevActiveFragment,
    activeFragmentRef
  }
) => {
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
      padding: '5px 0 40px 0',
      // height: '800px',
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
      zIndex: '100',
      backgroundColor: "#EEF2F6"
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

  const currentCall = useAppSelector(state => state.calls.currentCall);
  const isAuth = useAppSelector(state => state.auth.isAuth);

  useEffect(() => {
    if (!expanded && callAudio && bundleIndex) {
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


  useEffect(() => {
    return () => {
      setIsCallBodyData(false);
    }
  }, []);

  const {language} = useAppSelector(state => state.lang);

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


  const callActionSelectConverter = (values: any = []) => {
    let local: { value: any, label: string }[] = [];
    for (let i = 0; i < values.length; i++) {
      if (values[i] !== "analyze" && values[i] !== "get_api_tags") {
        if (values[i] === "delete") {
          local.unshift({value: values[i], label: translate(values[i], language)});
        } else {
          local.push({value: values[i], label: translate(values[i], language)});
        }
      }
    }
    return local;
  };

  // MW
  const [isOpen, setOpen] = useState(false);
  function handleMWOpen() {
    setOpen(true);
  }
  function handleMWClose() {
    setOpen(false);
  }
  // MW button
  const [MWButtonLoading, setMWButtonLoading] = useState(false);

  type SttFormType = {
    engine: "yandex" | "imot",
    keepFragments: boolean
  }
  const [sttForm, setSttForm] = useState<SttFormType>({
    engine: "imot",
    keepFragments: false
  });


  // onClick's действий со звонком
  async function formPublicToken(id: string) {
    const publicTokenData = await dispatch(getCallPublicToken(id));
    // @ts-ignore
    const publicToken: { access_token: string, token_type: string } = publicTokenData.payload;
    const host = window.location.origin;

    const publicUrl = `${host}/imot/#/${language}/call?id=${id}&token=${publicToken.access_token}`;
    navigator.clipboard.writeText(publicUrl);
    dispatch(langSlice.actions.setSnackbar({
      type: "success",
      text: "Публичная ссылка скопированна",
      value: true,
      time: 2000
    }));
  }

  async function rebootAction() {
    if (callStt) {
      dispatch(callsSlice.actions.setStt({
        stt: null,
        id: callInfo.id,
        index: bundleIndex
      }));

      await dispatch(callAction({
        id: callInfo.id,
        data: {
          action: "analyze",
          engine: callStt.engine,
          keep_fragments: false
        }
      }));

      const newCallInfoData = await dispatch(getCallInfo({id: callInfo.id}));
      dispatch(callsSlice.actions.setInfo({
        // @ts-ignore
        info: newCallInfoData.payload,
        id: callInfo.id,
        index: bundleIndex
      }));

      const newCallSttData = await dispatch(getCallStt({id: callInfo.id}));
      dispatch(callsSlice.actions.setStt({
        // @ts-ignore
        stt: newCallSttData.payload,
        id: callInfo.id,
        index: bundleIndex
      }));

      dispatch(langSlice.actions.setSnackbar({
        type: "success",
        text: "Звонок перераспознан",
        value: true,
        time: 2000
      }));
    }
  }

  async function sttAction() {
    handleMWOpen()
  }

  async function sttActionSubmit() {
    if (callStt) {
      setMWButtonLoading(true);
      await dispatch(callAction({
        id: callInfo.id,
        data: {
          action: "stt",
          engine: sttForm.engine,
          keep_fragments: sttForm.keepFragments
        }
      }));
      handleMWClose();
      setMWButtonLoading(false);
      dispatch(langSlice.actions.setSnackbar({
        type: "info",
        text: "Запрос на перераспознание отправлен",
        value: true,
        time: 2000
      }));
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
            {callStt ?
              <div>
                <Typography style={{marginBottom: '10px'}} className={classes.typographyTitle}>
                  Текстовый диалог:
                </Typography>
                <div className={classes.cbDialogItems} id={callId}>
                  <div>
                    {callStt.fragments.length > 1 ?
                      callStt.fragments.map((phrase, i, array) => {
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
                      })
                      : <Typography>У этого звонка нет stt</Typography>
                    }
                  </div>
                </div>
              </div> :
              <div style={{textAlign: "center"}}>
                <CircularProgress size={80}/>
              </div>
            }
          </div>
        </div>

        {/* Кнопочки */}
        <div style={{backgroundColor: 'fff', width: '370px', marginTop: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '14px'}}>

            {isAuth && (
              <Back
                onClick={(event) => {
                  formPublicToken(callId)
                }}
              />
            )}

            {/* Скачать */}
            <Download href={callAudio}/>

            {/* Перераспознать */}
            {callInfo.allowedActions.indexOf("analyze") != -1 && (
              <Reboot onClick={() => {
                rebootAction()
              }}/>
            )}

            {/* История */}
            <History/>


            {/* Удаление и смена каналов. */}
            <CustomControlSelect
              handleSelectChange={async (event) => {
                if (callStt) {
                  if (event.value === "stt") {
                    sttAction()
                  } else if (event.value === "delete") {
                    await dispatch(callAction({
                      id: callInfo.id,
                      data: {
                        action: event.value,
                        engine: callStt.engine,
                        keep_fragments: false
                      }
                    }));
                    dispatch(callsSlice.actions.deleteCall({id: callInfo.id, bundleIndex: bundleIndex}));
                    dispatch(langSlice.actions.setSnackbar({
                      type: "success",
                      text: "Звонок удален",
                      value: true,
                      time: 1500
                    }));
                  } else if (event.value === "swap_channels") {
                    if (callStt) {
                      dispatch(callsSlice.actions.setStt({
                        stt: null,
                        id: callInfo.id,
                        index: bundleIndex
                      }));

                      await dispatch(callAction({
                        id: callInfo.id,
                        data: {
                          action: event.value,
                          engine: callStt.engine,
                          keep_fragments: false
                        }
                      }));
                      const newCallSttData = await dispatch(getCallStt({id: callInfo.id}));
                      await dispatch(callsSlice.actions.setStt({
                        // @ts-ignore
                        stt: newCallSttData.payload,
                        id: callInfo.id,
                        index: bundleIndex
                      }));
                      dispatch(langSlice.actions.setSnackbar({
                        type: "success",
                        text: "Каналы поменяны местами",
                        value: true,
                        time: 2000
                      }));
                    }
                  }
                }
              }}
              svg={"vertical"}
              options={callActionSelectConverter(callInfo.allowedActions)}
              optionsPosition={"bottom"}
            />
          </div>

          {/* Params block*/}
          <BlockBox width={'auto'} height={'auto'} padding={'24px'} margin={'24px 14px 24px 24px'} borderRadius={'10px'}
                    boxShadow={'0px 0px 4px rgba(98, 98, 98, 0.22)'}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px'}}>
              <div style={{display: 'flex'}}>
                <Typography className={classes.typographyTitle}>Сотрудник:</Typography>
                <Typography style={{color: '#1B202B'}}>{callInfo.operatorPhone}</Typography>
              </div>
              <CallSvg/>
            </div>
            <div style={{display: 'flex', marginBottom: '12px'}}>
              <Typography className={classes.typographyTitle}>Клиент:</Typography>
              <Typography style={{color: '#1B202B'}}>{callInfo.clientPhone}</Typography>
            </div>
            <div style={{display: 'flex'}}>
              <Typography className={classes.typographyTitle}>Дата и время:</Typography>
              <Typography style={{color: '#1B202B'}}>{callInfo.callTimeReadable}</Typography>
            </div>
          </BlockBox>

        </div>
      </div>
      <ModalWindow
        isMWOpen={isOpen}
        handleMWClose={handleMWClose}
        text={"Параметры перераспознования"}
        width={'400px'}
      >
        <ToggleButtonGroup
          style={{marginTop: '15px'}}
          value={sttForm.engine}
          exclusive
          onChange={() => {
          }}
        >
          <ToggleButton
            value={"imot"}
            onClick={() => {
              setSttForm({...sttForm, engine: "imot"})
            }}
          >
            <img src={Logo} alt=""/>
          </ToggleButton>

          <ToggleButton
            value={"yandex"}
            onClick={() => {
              setSttForm({...sttForm, engine: "yandex"})
            }}
          >
            <img src={Yandex} width={60} alt=""/>
          </ToggleButton>
        </ToggleButtonGroup>

        <div style={{display: 'flex', margin: '15px 0'}}>
          <CustomCheckbox
            style={{marginRight: '10px'}}
            onClick={(event) => {
              setSttForm({...sttForm, keepFragments: !sttForm.keepFragments})
            }}
            checked={sttForm.keepFragments}
          />
          <Typography style={{cursor: "pointer"}}>
            Сохранять фрагменты
          </Typography>
        </div>
        <div>
          <LoadingButton
            loading={MWButtonLoading}
            style={{marginRight: '15px'}}
            variant="contained"
            color="primary"
            onClick={sttActionSubmit}
          >
            {translate("sendButton", language)}
          </LoadingButton>
          <LoadingButton
            variant="contained"
            color="secondary"
            onClick={handleMWClose}
          >
            {translate("cancelButton", language)}
          </LoadingButton>
        </div>
      </ModalWindow>

    </div>
  );
});


export default CallBody;