import React, {FC, memo, MutableRefObject, useState} from 'react';
import {makeStyles} from "@mui/styles";
import {BlockBox} from "../../../components";
import {Typography} from "@mui/material";
import cn from 'classnames';
import {BaseTag} from "../../../components/Tag";
import {CallSttFragmentType} from "../../../store/calls/calls.types";
import {timeConverter} from "../Call";

const HeadphoneIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="30" height="30" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M2.83301 6C2.83301 3.44518 5.22129 1.5 7.99967 1.5C10.7781 1.5 13.1663 3.44518 13.1663 6H12.1663C12.1663 4.13654 10.376 2.5 7.99967 2.5C5.6234 2.5 3.83301 4.13654 3.83301 6H2.83301Z"
            fill="#738094"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M12.6663 10.167C12.9425 10.167 13.1663 10.3908 13.1663 10.667C13.1663 12.4159 11.7486 13.8337 9.99967 13.8337H7.33301C7.05687 13.8337 6.83301 13.6098 6.83301 13.3337C6.83301 13.0575 7.05687 12.8337 7.33301 12.8337H9.99967C11.1963 12.8337 12.1663 11.8636 12.1663 10.667C12.1663 10.3908 12.3902 10.167 12.6663 10.167Z"
            fill="#A3AEBE"/>
      <path d="M2 7.33333C2 6.59695 2.59695 6 3.33333 6H5V10.6667H3.33333C2.59695 10.6667 2 10.0697 2 9.33333V7.33333Z"
            fill="#738094"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M3.33333 6.5C2.8731 6.5 2.5 6.8731 2.5 7.33333V9.33333C2.5 9.79359 2.87309 10.1667 3.33333 10.1667H4.5V6.5H3.33333ZM1.5 7.33333C1.5 6.32081 2.32081 5.5 3.33333 5.5H5C5.27614 5.5 5.5 5.72386 5.5 6V10.6667C5.5 10.9428 5.27614 11.1667 5 11.1667H3.33333C2.32082 11.1667 1.5 10.3459 1.5 9.33333V7.33333Z"
            fill="#738094"/>
      <path
        d="M14 7.33333C14 6.59695 13.4031 6 12.6667 6H11V10.6667H12.6667C13.4031 10.6667 14 10.0697 14 9.33333V7.33333Z"
        fill="#738094"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M10.5 6C10.5 5.72386 10.7239 5.5 11 5.5H12.6667C13.6792 5.5 14.5 6.32082 14.5 7.33333V9.33333C14.5 10.3459 13.6792 11.1667 12.6667 11.1667H11C10.7239 11.1667 10.5 10.9428 10.5 10.6667V6ZM11.5 6.5V10.1667H12.6667C13.1269 10.1667 13.5 9.79359 13.5 9.33333V7.33333C13.5 6.87309 13.1269 6.5 12.6667 6.5H11.5Z"
            fill="#738094"/>
      <path
        d="M9.33366 13.3333C9.33366 12.597 8.73671 12 8.00033 12C7.26395 12 6.66699 12.597 6.66699 13.3333C6.66699 14.0697 7.26395 14.6667 8.00033 14.6667C8.73671 14.6667 9.33366 14.0697 9.33366 13.3333Z"
        fill="#738094"/>
    </svg>
  );
};

const CustomerIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="30" height="30" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6 0.5C4.61929 0.5 3.5 1.61929 3.5 3C3.5 4.38071 4.61929 5.5 6 5.5C7.38073 5.5 8.5 4.38071 8.5 3C8.5 1.61929 7.38073 0.5 6 0.5Z"
        fill="#A3AEBE"/>
      <path
        d="M3.33398 6.83301C1.95327 6.83301 0.833984 7.95227 0.833984 9.33301V10.1252C0.833984 10.6273 1.1979 11.0555 1.6935 11.1364C4.54605 11.6021 7.45525 11.6021 10.3078 11.1364C10.8034 11.0555 11.1673 10.6273 11.1673 10.1252V9.33301C11.1673 7.95227 10.0481 6.83301 8.66732 6.83301H8.44005C8.31705 6.83301 8.19485 6.85247 8.07792 6.89061L7.50092 7.07907C6.52605 7.39734 5.47525 7.39734 4.50038 7.07907L3.92336 6.89061C3.80644 6.85247 3.68422 6.83301 3.56123 6.83301H3.33398Z"
        fill="#738094"/>
    </svg>
  );
};

type DialogItemType = {
  fragment: CallSttFragmentType,
  fragmentIndex: number,
  callId: string
};

const NewDialogItem: FC<DialogItemType> = memo(({fragment, fragmentIndex, callId}) => {
  const useStyles = makeStyles(({
    diItem: {
      display: 'flex',
      margin: '3px 0'
    },
    diCustomer: {
      flexDirection: 'row-reverse'
    },

    diBodyInner: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'end',
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
      paddingRight: '45px !important'
    },
    dateTypography: {
      // @ts-ignore
      position: 'absolute !important',
      bottom: '-3px',
      right: '2px',
      fontSize: '11px !important',
      color: '#A19F99 !important',
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
      color: '#738094 !important',
      fontWeight: '700 !important',
      minWidth: '110px !important'
    }
  }))

  const classes = useStyles();
  const condition = fragment.direction === 'client'
  const svgStyles = {backgroundColor: '#ffffff', padding: '8px', borderRadius: '5px', margin: '0 8px'}
  return (
    <div className={cn(classes.diItem, condition ? classes.diCustomer : null)}>
      {/* Icon */}
      {condition
        ? <CustomerIcon style={svgStyles}/>
        : <HeadphoneIcon style={svgStyles}/>
      }
      {/* DIBody */}
      <BlockBox padding={'3px 7px'} borderRadius={'3px'} height={'100%'}>
        <Typography style={{marginLeft: '2px'}} className={classes.typographyTitle}>{`${condition ? 'Клиент' : 'Сотрудник'}:`}</Typography>
        <div className={classes.diBodyInner}>
          <Typography className={classes.diBodyText}>
            {fragment.words.map((word, j) => (
              <span
                id={`${callId}-${fragmentIndex}-${j}`}
                className={classes.diFragment}
                key={j}
              >
                {word.word}
              </span>
            ))}
          </Typography>
          <Typography className={classes.dateTypography}>{timeConverter(fragment.begin, false)}</Typography>
        </div>
      </BlockBox>
    </div>
  );
});

export default NewDialogItem;