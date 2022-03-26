import React, {FC} from 'react';
import {makeStyles} from "@mui/styles";
import {BlockBox} from "../../../components";
import {Typography} from "@mui/material";
import cn from 'classnames';
import {BaseTag} from "../../../components/Tag";

const HeadphoneIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
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
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6 0.5C4.61929 0.5 3.5 1.61929 3.5 3C3.5 4.38071 4.61929 5.5 6 5.5C7.38073 5.5 8.5 4.38071 8.5 3C8.5 1.61929 7.38073 0.5 6 0.5Z"
        fill="#A3AEBE"/>
      <path
        d="M3.33398 6.83301C1.95327 6.83301 0.833984 7.95227 0.833984 9.33301V10.1252C0.833984 10.6273 1.1979 11.0555 1.6935 11.1364C4.54605 11.6021 7.45525 11.6021 10.3078 11.1364C10.8034 11.0555 11.1673 10.6273 11.1673 10.1252V9.33301C11.1673 7.95227 10.0481 6.83301 8.66732 6.83301H8.44005C8.31705 6.83301 8.19485 6.85247 8.07792 6.89061L7.50092 7.07907C6.52605 7.39734 5.47525 7.39734 4.50038 7.07907L3.92336 6.89061C3.80644 6.85247 3.68422 6.83301 3.56123 6.83301H3.33398Z"
        fill="#738094"/>
    </svg>
  );
};

const AddSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7.2627 4.52539C7.57335 4.52539 7.8252 4.77723 7.8252 5.08789V6.58788H9.3252C9.63585 6.58788 9.8877 6.83973 9.8877 7.15038C9.8877 7.46103 9.63585 7.71288 9.3252 7.71288H7.8252V9.21288C7.8252 9.52353 7.57335 9.77538 7.2627 9.77538C6.95205 9.77538 6.7002 9.52353 6.7002 9.21288V7.71288H5.2002C4.88953 7.71288 4.6377 7.46103 4.6377 7.15038C4.6377 6.83973 4.88953 6.58788 5.2002 6.58788H6.7002V5.08789C6.7002 4.77723 6.95205 4.52539 7.2627 4.52539Z"
        fill="#1B202B"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M1.44435 9.47815C-0.241548 5.34006 2.80278 0.8125 7.27113 0.8125H7.51218C10.854 0.8125 13.563 3.52151 13.563 6.8632C13.563 10.5839 10.5468 13.6 6.82615 13.6H0.960964C0.722277 13.6 0.50957 13.4493 0.430355 13.2242C0.351132 12.999 0.422644 12.7484 0.608749 12.5989L2.08737 11.4114C2.15202 11.3595 2.17489 11.2713 2.1436 11.1945L1.44435 9.47815ZM7.27113 1.9375C3.60174 1.9375 1.10175 5.65555 2.48621 9.05373L3.18546 10.7701C3.40446 11.3076 3.24437 11.9252 2.7918 12.2886L2.55972 12.475H6.82615C9.92545 12.475 12.438 9.9625 12.438 6.8632C12.438 4.14283 10.2327 1.9375 7.51218 1.9375H7.27113Z"
            fill="#1B202B"/>
    </svg>
  );
};


const useStyles = makeStyles(({
  diItem: {
    display: 'flex',
    margin: '25px',
  },
  diCustomer: {
    flexDirection: 'row-reverse'
  },

  diBodyInner: {
    maxWidth: '308px',
    width: '100%'
  },
  diBodyText: {
    lineHeight: '22px !important',
    color: '#738094 !important'
  },

  diTagsBlock: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: '0 16px'
  },
}));

type DialogItemType = {
  person: 'operator' | 'client',
  text: string
};

const DialogItem: FC<DialogItemType> = ({person, text}) => {
  const classes = useStyles();
  const condition = person === 'client'
  const svgStyles = {backgroundColor: '#ffffff', padding: '8px', borderRadius: '5px', margin: '0 8px'}
  return (
    <div className={cn(classes.diItem, condition ? classes.diCustomer : null)}>
      {/* Icon */}
      {condition
        ? <CustomerIcon style={svgStyles}/>
        : <HeadphoneIcon style={svgStyles}/>
      }
      {/* DIBody */}
      <BlockBox padding={'16px 26px 16px 16px'}>
        <div className={classes.diBodyInner}>
          <Typography className={classes.diBodyText}>
            {text}
          </Typography>
        </div>
      </BlockBox>

      {/* Tags */}
      <div className={classes.diTagsBlock}>
        <div style={condition ? {textAlign: 'right'} : {textAlign: 'left'}}>
          <BaseTag body={"Тег"}/>
          <BaseTag body={"Тег"}/>
        </div>
        <AddSvg style={condition ? {margin: '0 0 0 auto'} : {margin: '0 auto 0 0'}}/>
      </div>
    </div>
  );
};

export default DialogItem;