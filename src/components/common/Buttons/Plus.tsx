import React, {FC} from 'react';
import IconButton from "../IconButton";

const PlusSvg = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.00034 2.66699C8.38454 2.66699 8.69599 2.97845 8.69599 3.36264V12.638C8.69599 13.0222 8.38454 13.3337 8.00034 13.3337C7.61614 13.3337 7.30469 13.0222 7.30469 12.638V3.36264C7.30469 2.97845 7.61614 2.66699 8.00034 2.66699Z" fill="#389E0D"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M2.66602 8.00034C2.66602 7.61614 2.97747 7.30469 3.36167 7.30469H12.637C13.0212 7.30469 13.3327 7.61614 13.3327 8.00034C13.3327 8.38454 13.0212 8.69599 12.637 8.69599H3.36167C2.97747 8.69599 2.66602 8.38454 2.66602 8.00034Z" fill="#389E0D"/>
    </svg>
  );
};

type PlusPropsType = {
  margin?: string,
  handleClick?: any,
  disabled?: boolean
}

const Plus: FC<PlusPropsType> = ({disabled, margin, handleClick}) => {
  return (
    <IconButton
      disabled={disabled}
      margin={margin ? margin : '0 15px 0 0'}
      backgroundColor="#D9F7BE"
      icon={<PlusSvg/>}
      onClick={handleClick}
    />
  );
};

export default Plus;