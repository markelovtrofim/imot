import React, {FC} from 'react';
import IconButton from "../IconButton";
import {useAppSelector} from "../../../hooks/redux";

const DownloadSvg = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M3.33398 10.833C3.61012 10.833 3.83398 11.0569 3.83398 11.333V12.6663C3.83398 12.7584 3.9086 12.833 4.00065 12.833H12.0007C12.0927 12.833 12.1673 12.7584 12.1673 12.6663V11.333C12.1673 11.0569 12.3912 10.833 12.6673 10.833C12.9435 10.833 13.1673 11.0569 13.1673 11.333V12.6663C13.1673 13.3107 12.645 13.833 12.0007 13.833H4.00065C3.35632 13.833 2.83398 13.3107 2.83398 12.6663V11.333C2.83398 11.0569 3.05784 10.833 3.33398 10.833Z"
            fill="#A3AEBE"/>
      <path
        d="M7.15864 2.5C6.81578 2.5 6.52969 2.76208 6.49974 3.1037C6.39732 4.27217 6.37925 5.44639 6.44563 6.61723C6.28097 6.62633 6.11638 6.63687 5.95186 6.64887L4.95886 6.72127C4.57599 6.74913 4.36196 7.17607 4.56866 7.49953C5.27669 8.6076 6.189 9.57087 7.25698 10.3381L7.65478 10.6239C7.86111 10.7721 8.13904 10.7721 8.34538 10.6239L8.74318 10.3381C9.81118 9.57087 10.7234 8.6076 11.4315 7.49953C11.6382 7.17607 11.4242 6.74913 11.0413 6.72127L10.0483 6.64887C9.88378 6.63687 9.71918 6.62633 9.55451 6.61723C9.62091 5.44639 9.60284 4.27217 9.50044 3.10369C9.47044 2.76208 9.18438 2.5 8.84151 2.5H7.15864Z"
        fill="#738094"/>
    </svg>

  );
};


type DownloadHrefPropsType = {
  href: string | null,
}

export const DownloadHref: FC<DownloadHrefPropsType> = ({href}) => {
  const currentCall = useAppSelector(state => state.calls.currentCall);

  return (
    <IconButton
      onClick={() => {}}
      disabled={!href}
      icon={
        // @ts-ignore
        <a href={href ? href : currentCall ? currentCall.audio : ""} download="">
          <DownloadSvg/>
        </a>
      }

      margin={'0 15px 0 0'}
      backgroundColor="#E3E8EF"

      tooltipTitle={"Скачать"}
      tooltipPlacement={"top"}
    />
  );
};


type DownloadOnClickPropsType = {
  onClick: (event: any) => void,
}

export const DownloadOnClick: FC<DownloadOnClickPropsType> = ({onClick}) => {
  const currentCall = useAppSelector(state => state.calls.currentCall);

  return (
    <IconButton
      onClick={onClick}
      icon={<DownloadSvg/>}

      margin={'0 15px 0 0'}
      backgroundColor="#E3E8EF"

      tooltipTitle={"Скачать"}
      tooltipPlacement={"top"}
    />
  );
};

