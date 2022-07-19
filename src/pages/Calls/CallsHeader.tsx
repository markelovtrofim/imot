import React, {FC, useState} from 'react';
import {Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import Grid from "@mui/material/Grid";
import {useAppSelector} from "../../hooks/redux";
import {useDispatch} from "react-redux";
import {RootState} from "../../store/store";
import {translate} from "../../localizations";
import {
  callsAction,
  callsSlice, deleteCall,
  getActionFiles, getAndSetCallInfo, getAndSetCallStt,
  getBaseCallsData, getTask,
  SelectedCallType
} from "../../store/calls/calls.slice";
import {DownloadOnClick} from "../../components/common/Buttons/Download";
import Reboot from "../../components/common/Buttons/Reboot";
import IconButton from "../../components/common/IconButton";
import CustomControlSelect from "../../components/common/Selects/CustomControlSelect";
import {langSlice} from "../../store/lang/lang.slice";
import ContainedSelect from "../../components/common/Selects/ContainedSelect";
import cloneDeep from "lodash.clonedeep";
import {current} from "@reduxjs/toolkit";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Logo from "../../assets/images/logo.png";
import Yandex from "../../assets/images/yandex_PNG20.png";
import CustomCheckbox from "../../components/common/Checkbox";
import {LoadingButton} from "@mui/lab";
import ModalWindow from "../../components/common/ModalWindowBox";

const useStyles = makeStyles(({
  callsHeader: {

    background: '#fff',
    borderRadius: '10px 10px 0 0'
  },
  callsTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 12px 20px 24px'
  },
  callsCols: {
    borderTop: '2px solid #F8FAFC',
    padding: '16px 24px',
  },
  callsTitleText: {
    fontWeight: '700 !important'
  }
}))

const ClockSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="19" viewBox="0 0 20 19" fill={props.fill ? props.fill : '#738094'}
       xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.53033 0.469667C4.82322 0.762557 4.82322 1.23744 4.53033 1.53033L2.03033 4.03033C1.73744 4.32322 1.26256 4.32322 0.969667 4.03033C0.676778 3.73744 0.676778 3.26256 0.969667 2.96967L3.46967 0.469667C3.76256 0.176778 4.23744 0.176778 4.53033 0.469667Z"
      fill="#738094"/>
    <path fillRule="evenodd" clipRule="evenodd"
          d="M10 1.5C5.30558 1.5 1.5 5.30558 1.5 10C1.5 14.6944 5.30558 18.5 10 18.5C14.6944 18.5 18.5 14.6944 18.5 10C18.5 5.30558 14.6944 1.5 10 1.5ZM10.75 5C10.75 4.58579 10.4142 4.25 10 4.25C9.5858 4.25 9.25 4.58579 9.25 5V10C9.25 10.2586 9.3832 10.4989 9.6025 10.636L12.6025 12.511C12.9538 12.7305 13.4165 12.6238 13.636 12.2725C13.8555 11.9212 13.7488 11.4585 13.3975 11.239L10.75 9.5843V5Z"
          fill="#738094"/>
    <path
      d="M15.4697 1.53033C15.1768 1.23744 15.1768 0.762557 15.4697 0.469667C15.7626 0.176778 16.2374 0.176778 16.5303 0.469667L19.0303 2.96967C19.3232 3.26256 19.3232 3.73744 19.0303 4.03033C18.7374 4.32322 18.2626 4.32322 17.9697 4.03033L15.4697 1.53033Z"
      fill="#738094"/>
  </svg>
);

const ArrowsSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="6" height="12" viewBox="0 0 6 12" fill={props.fill ? props.fill : '#738094'}
       xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M2.56736 0.75C2.75981 0.416667 3.24094 0.416667 3.43339 0.75L5.16544 3.75C5.35789 4.08333 5.11733 4.5 4.73243 4.5H1.26832C0.883424 4.5 0.642861 4.08333 0.835311 3.75L2.56736 0.75Z"/>
    <path
      d="M3.43264 11.25C3.24019 11.5833 2.75906 11.5833 2.56661 11.25L0.834562 8.25C0.642112 7.91667 0.882675 7.5 1.26757 7.5H4.73168C5.11658 7.5 5.35714 7.91667 5.16469 8.25L3.43264 11.25Z"/>
  </svg>
);

type CallsHeaderPropsType = {
  found: any,
  total?: any,
  switchTitleFound: boolean
};

const CallsHeader: FC<CallsHeaderPropsType> = React.memo((
  {
    found,
    total,
    switchTitleFound
  }
) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {language} = useAppSelector((state: RootState) => state.lang);

  const selectAllCalls = useAppSelector(state => state.calls.isSelectAllCalls);
  const currentUser = useAppSelector(state => state.users.currentUser);
  const selectedCalls = useAppSelector(state => state.calls.selectedCalls);

  const calls = useAppSelector(state => state.calls.calls);

  const sortParams = useAppSelector(state => state.calls.sort);
  const sortArray = [
    {value: "date", label: translate("date", language)},
    {value: "duration", label: translate("duration", language)},
    {value: "grade", label: translate("grade", language)}
  ];

  function selectedCallsConverter(selectedCalls: SelectedCallType[]) {
    return selectedCalls.map(call => call.callId);
  }


  async function superMegaUltraHardFunction(selectedCalls: SelectedCallType[]) {
    await selectedCalls.forEach(async (selectedCall) => {
      await dispatch(getAndSetCallInfo({id: selectedCall.callId, bundleIndex: selectedCall.bundleIndex}));
      await dispatch(getAndSetCallStt({id: selectedCall.callId, bundleIndex: selectedCall.bundleIndex}));
    });
  }

  type SttFormType = {
    engine: "yandex" | "imot",
    keepFragments: boolean
  }

  const [sttForm, setSttForm] = useState<SttFormType>({
    engine: "imot",
    keepFragments: false
  });

  const [MWButtonLoading, setMWButtonLoading] = useState<boolean>(false);

  const [isMWOpen, setMWOpen] = useState<boolean>(false)
  function handleMWClose() {
    setMWOpen(false);
  }
  function handleMWOpen() {
    setMWOpen(true);
  }

  // calls buttons
  async function downloadAction() {
    if (currentUser) {
      const action = "audio_archive";
      const taskIdData = await dispatch(callsAction({
        action: action,
        engine: "imot",
        keep_fragments: false,
        call_ids: selectedCallsConverter(selectedCalls),
      }));
      // @ts-ignore
      const taskPayload = taskIdData.payload;
      if (taskPayload) {
        const taskId = taskPayload.data.task_id;
        await dispatch(getActionFiles({taskId, action}));
      } else {
        dispatch(langSlice.actions.setSnackbar({
          type: "info",
          text: "Выберите звонки",
          value: true,
          time: 2000
        }));
      }
    }
  }

  async function excelAction() {
    if (currentUser) {
      const action = "stt_export";
      const taskIdData = await dispatch(callsAction({
        action: action,
        engine: "imot",
        keep_fragments: false,
        call_ids: selectedCallsConverter(selectedCalls),
      }));
      // @ts-ignore
      const taskPayload = taskIdData.payload;
      if (taskPayload) {
        const taskId = taskPayload.data.task_id;
        await dispatch(getActionFiles({taskId, action}));
      } else {
        dispatch(langSlice.actions.setSnackbar({
          type: "info",
          text: "Выберите звонки",
          value: true,
          time: 2000
        }));
      }
    }
  }

  async function rebootAction() {
    if (currentUser) {
      const action = "analyze";
      dispatch(langSlice.actions.setSnackbar({
        type: "info",
        text: "Запрос отправлен",
        value: true,
        time: 2000
      }));
      const taskIdData = await dispatch(callsAction({
        action: action,
        engine: "imot",
        keep_fragments: false,
        call_ids: selectedCallsConverter(selectedCalls),
      }));
      // @ts-ignore
      const taskPayload = taskIdData.payload;
      if (taskPayload) {
        const taskId = taskPayload.data.task_id;
        await dispatch(getTask(taskId));
        superMegaUltraHardFunction(selectedCalls);
      } else {
        dispatch(langSlice.actions.setSnackbar({
          type: "info",
          text: "Выберите звонки",
          value: true,
          time: 2000
        }));
      }
      dispatch(langSlice.actions.setSnackbar({
        type: "success",
        text: "Звонки перераспознаны",
        value: true,
        time: 2000
      }));
    }
  }

  async function deleteAction() {
    let callsLocal = [...cloneDeep(calls)];
    dispatch(langSlice.actions.setSnackbar({
      type: "info",
      text: "Запрос отправлен",
      value: true,
      time: 2000
    }));
    for (const selectedCall of selectedCalls) {
      if (selectedCall.bundleIndex || selectedCall.bundleIndex === 0) {
        await dispatch(deleteCall(selectedCall.callId));
        let currentCalls = callsLocal[selectedCall.bundleIndex];
        const call = currentCalls.find(item => {
          if (item.info) {
            return item.info.id === selectedCall.callId;
          }
        })
        let callIndex = -1;
        if (call) {
          callIndex = currentCalls.indexOf(call);
        }
        if (callIndex != -1) {
          currentCalls.splice(callIndex, 1);
        }
        callsLocal[selectedCall.bundleIndex] = currentCalls
      }
    }
    dispatch(callsSlice.actions.setCalls(callsLocal));
    dispatch(callsSlice.actions.removeSelectedCalls(null));
    dispatch(langSlice.actions.setSnackbar({
      type: "success",
      text: "Звонки удалены",
      value: true,
      time: 2000
    }));
  }

  async function sttSubmit() {
    handleMWOpen();
  }

  async function sttActionSubmit() {
    if (currentUser) {
      const action = "stt";
      dispatch(langSlice.actions.setSnackbar({
        type: "info",
        text: "Запрос отправлен",
        value: true,
        time: 2000
      }));
      const taskIdData = await dispatch(callsAction({
        action: action,
        engine: sttForm.engine,
        keep_fragments: sttForm.keepFragments,
        call_ids: selectedCallsConverter(selectedCalls),
      }));
      // @ts-ignore
      const taskPayload = taskIdData.payload;
      if (taskPayload) {
        const taskId = taskPayload.data.task_id;
        await dispatch(getTask(taskId));
        superMegaUltraHardFunction(selectedCalls);
      } else {
        dispatch(langSlice.actions.setSnackbar({
          type: "info",
          text: "Выберите звонки",
          value: true,
          time: 2000
        }));
      }
    }
  }

  async function swapChannelsAction() {
    const action = "swap_channels";
    const taskIdData = await dispatch(callsAction({
      action: action,
      engine: "imot",
      keep_fragments: false,
      call_ids: selectedCallsConverter(selectedCalls),
    }));
    // @ts-ignore
    const taskPayload = taskIdData.payload;
    if (taskPayload) {
      const taskId = taskPayload.data.task_id;
      await dispatch(getTask(taskId));
      superMegaUltraHardFunction(selectedCalls);
    } else {
      dispatch(langSlice.actions.setSnackbar({
        type: "info",
        text: "Выберите звонки",
        value: true,
        time: 2000
      }));
    }
    dispatch(langSlice.actions.setSnackbar({
      type: "success",
      text: "Каналы поменяны местами",
      value: true,
      time: 2000
    }));
  }

  return (
    <div className={classes.callsHeader}>
      <div className={classes.callsTitle}>
        <div>
          {!switchTitleFound ?
            <Typography className={classes.callsTitleText}>Найдено звонков {found} из {total}</Typography>
            :
            <Typography className={classes.callsTitleText}>Найдено {found} звонков</Typography>
          }
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div>
            <ContainedSelect
              width={"150px"}
              onSelectChange={(event) => {
                if (event.value === "grade") {
                  dispatch(langSlice.actions.setSnackbar({
                    type: "error",
                    text: "Этот вид сортировки пока не работает",
                    value: true,
                    time: 2000
                  }));
                } else {
                  dispatch(callsSlice.actions.setSort(event.value));
                  dispatch(callsSlice.actions.zeroingSkip(null));
                  dispatch(callsSlice.actions.setEmptyState({leaveBundles: 0}))
                  if (event.value === "duration") {
                    dispatch(getBaseCallsData({sort: event.value}))
                  } else if (event.value === "date") {
                    dispatch(getBaseCallsData({}))
                  }
                }
              }}
              options={sortArray}
              value={{value: sortParams, label: translate(sortParams, language)}}
            />
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginLeft: '20px'}}>
            {/* Скачать */}
            <DownloadOnClick onClick={() => {downloadAction().then()}}/>

            {/* Excel export */}
            <IconButton
              onClick={() => {excelAction().then()}}
              icon={
                <Typography style={{fontSize: "13px"}}>ex</Typography>
              }
              margin={'0 15px 0 0'}
              backgroundColor="#E3E8EF"
              tooltipTitle={"Excel экспорт"}
              tooltipPlacement={"top"}
            />

            {/* Перераспознать */}
            <Reboot onClick={() => {rebootAction().then()}}/>

            {/* Удаление и смена каналов. */}
            <CustomControlSelect
              handleSelectChange={async (event) => {
                if (event.value === "delete") deleteAction().then();
                else if (event.value === "stt") sttSubmit().then();
                else if (event.value === "swap_channels") swapChannelsAction().then();
              }}
              svg={"vertical"}
              options={[
                {value: 'delete', label: "Удалить"},
                {value: "swap_channels" ,label: "Поменять каналы местами"},
                {value: "stt", label: "Перетегировать"}
              ]}
              optionsPosition={"bottom"}
            />
          </div>
        </div>
      </div>
      <Grid container className={classes.callsCols}>
        <Grid item xs={0.5} style={{minWidth: '50px', display: 'flex', alignItems: 'center'}}>
          <span style={{marginRight: '15px'}}><ClockSvg/></span>
          <ArrowsSvg/>
        </Grid>

        <Grid item xs={1.23} style={{minWidth: '100px', display: 'flex', alignItems: 'center'}}>
          <Typography
            style={{marginRight: '15px', fontWeight: '600'}}>{translate('callsEmployee', language)}</Typography>
        </Grid>

        <Grid item xs={3.5} style={{minWidth: '130px', display: 'flex', alignItems: 'center'}}>
          <Typography
            style={{marginRight: '15px', fontWeight: '600'}}>{translate('callsCustomer', language)}</Typography>
        </Grid>

        <Grid item xs={1} style={{minWidth: '130px', display: 'flex', alignItems: 'center'}}>
          <Typography style={{marginRight: '15px', fontWeight: '600'}}>{translate('callsTag', language)}</Typography>
        </Grid>
      </Grid>

      <ModalWindow
        isMWOpen={isMWOpen}
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
  )
})

export default CallsHeader;