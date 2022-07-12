import React, { FC, memo, MutableRefObject, useState } from 'react';

import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import cn from 'classnames';
import { useDispatch, useSelector } from "react-redux";

import { BlockBox } from "../../../components/common";
import { BaseTag } from "../../../components/common/Tag";
import { callsSlice } from '../../../store/calls/calls.slice';
import { CallSttFragmentType } from "../../../store/calls/calls.types";
import { timeConverter } from "../Call";
import DictionaryPopup from './DictionaryPopup';

type DialogItemType = {
  prevFragment: CallSttFragmentType | { direction: string },
  fragment: CallSttFragmentType,
  fragmentIndex: number,
  callId: string,
  audioPlayerRef: any
};
type CursorPositionType = {
  top: number | undefined,
  left: number | undefined,
}

const DialogItem: FC<DialogItemType> = memo(({ prevFragment, fragment, fragmentIndex, callId, audioPlayerRef }) => {
  const useStyles = makeStyles(({
    diItem: {
      display: 'flex',
      margin: '3px 0',
    },
    diBodyInner: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      position: 'relative',
      maxWidth: '700px',
    },
    diBodyText: {
      display: 'flex',
      flexWrap: 'wrap',
      position: 'relative',
      maxWidth: '600px !important',
      height: '100% !important',
      lineHeight: '22px !important',
      color: '#738094 !important',
      paddingRight: '45px !important',
      padding: '7px',
      paddingTop: '0px',
    },
    dateTypography: {
      fontSize: '14px !important',
    },
    diTagsBlock: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      margin: '0 16px'
    },
    diFragment: {
      padding: '0 2px',
      borderRadius: '3px'
    },
    typographyTitle: {
      textAlign: 'right',
      color: '#738094 !important',
      fontWeight: '700 !important',
      minWidth: '110px !important',
      marginRight: '10px !important'
    },
    titleCustomer: {
      color: '#0009FF !important'
    },
    titleEmployee: {
      color: '#FF0E00 !important'
    },
  }))

  const dispatch = useDispatch();
  const [selectionText, setSelectionText] = useState<string>("");
  const [isUserSelectText, setIsUserSelectText] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<CursorPositionType>({
    top: 0,
    left: 0,
  });
  const classes = useStyles();
  const condition = fragment.direction === 'client';

  const {popupVisible, popupPosition} = useSelector((state: any) => state.calls);

  function onMouseUpFunction(event: any) {
    if (window.getSelection()) {
      const select: any = window.getSelection();
      const selectionText = select.toString();

      if (selectionText) {
        const bounds = event.currentTarget.getBoundingClientRect();
        const y = event.clientY - bounds.top;
        const x = event.clientX - bounds.left;
        console.log(x, y);
        console.log(event.clientX, event.clientY);
        console.log(event.pageX, event.pageY);

        const XX = window.innerWidth - event.clientX;
        const YY = window.innerHeight - event.clientY;

        dispatch(callsSlice.actions.setDictionaryPopupParams({ 
          popupVisible: true,
          popupPosition: {
            top: YY,
            left: XX,
          },
         }));
        setCursorPosition({ top: y, left: x })
        setIsUserSelectText(true);
        setSelectionText(selectionText.replace(/\s+/g, ' ').trim());
      }
    }
  }

  return (
    <div className={classes.diItem}>
      {/* DIBody */}
      <div className={classes.diBodyInner}>
        <Typography
          className={classes.dateTypography}>
          {timeConverter(fragment.begin, false)}
        </Typography>
        <Typography
          className={cn(classes.typographyTitle, condition ? classes.titleCustomer : classes.titleEmployee)}
        >
          {prevFragment
            ?
            prevFragment.direction !== fragment.direction && <>{`${condition ? 'Клиент' : 'Сотрудник'}:`}</>
            :
            <></>
          }
        </Typography>

        <Typography className={classes.diBodyText} onMouseUp={onMouseUpFunction}>
          {fragment.words.map((word, j) => (
            <span
              onClick={() => {
                audioPlayerRef.current.audioEl.current.play();
                audioPlayerRef.current.audioEl.current.currentTime = word.begin / 1000 + 0.01;
              }}
              id={`${callId}-${fragmentIndex}-${j}`}
              className={classes.diFragment}
              key={j}
            >
              {word.word}
            </span>
          ))}

          {
            isUserSelectText
            && <DictionaryPopup popupPosition={cursorPosition} selectionText={selectionText} />
          }
        </Typography>
      </div>


    </div>
  );
});

export default DialogItem;