import React, { FC, memo, MutableRefObject, useState } from 'react';
import { makeStyles } from "@mui/styles";
import { BlockBox } from "../../../components/common";
import { Typography } from "@mui/material";
import cn from 'classnames';
import { BaseTag } from "../../../components/common/Tag";
import { CallSttFragmentType } from "../../../store/calls/calls.types";
import { timeConverter } from "../Call";

type DialogItemType = {
  prevFragment: CallSttFragmentType | { direction: string },
  fragment: CallSttFragmentType,
  fragmentIndex: number,
  callId: string,
  audioPlayerRef: any
};

const DialogItem: FC<DialogItemType> = memo(({ prevFragment, fragment, fragmentIndex, callId, audioPlayerRef }) => {
  const useStyles = makeStyles(({
    diItem: {
      display: 'flex',
      margin: '3px 0'
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
      maxWidth: '600px !important',
      height: '100% !important',
      lineHeight: '22px !important',
      color: '#738094 !important',
      paddingRight: '45px !important',
      padding: '7px',
      paddingTop: '0px',
      border: '1px solid black'
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

  const classes = useStyles();
  const condition = fragment.direction === 'client';

  function onMouseUpFunction() {
    if (window.getSelection()) {
      const select: any = window.getSelection();
      const selectionText = select.toString();
      
      if(selectionText) {
        alert(selectionText);
        console.log(selectionText.replace(/\s+/g, ' ').trim());
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
        </Typography>
      </div>
    </div>
  );
});

export default DialogItem;