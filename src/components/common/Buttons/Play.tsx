import React, {useState} from 'react';
import IconButton from "../IconButton";

const PlaySvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.844 9.01076C13.5053 8.49909 13.5053 7.50083 12.844 6.98916C10.8457 5.44289 8.61422 4.22413 6.23319 3.37847L5.79821 3.22398C4.96603 2.92842 4.08702 3.49146 3.97436 4.35049C3.65959 6.75063 3.65959 9.24929 3.97436 11.6494C4.08702 12.5085 4.96603 13.0715 5.79821 12.776L6.23319 12.6214C8.61422 11.7758 10.8457 10.557 12.844 9.01076Z" fill="white"/>
    </svg>
  );
};

const PauseSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.02762 12.8445C7.34275 9.62246 7.34275 6.37738 7.02762 3.15532C6.99928 2.8655 6.80055 2.62146 6.52582 2.53229C5.43054 2.17674 4.23576 2.17674 3.14048 2.53229C2.86577 2.62146 2.66701 2.8655 2.63867 3.15532C2.32357 6.37738 2.32357 9.62246 2.63867 12.8445C2.66701 13.1343 2.86577 13.3784 3.14048 13.4676C4.23576 13.8231 5.43054 13.8231 6.52582 13.4676C6.80055 13.3784 6.99928 13.1343 7.02762 12.8445Z" fill="white"/>
      <path d="M13.3616 12.8445C13.6767 9.62246 13.6767 6.37738 13.3616 3.15532C13.3333 2.8655 13.1345 2.62146 12.8598 2.53229C11.7645 2.17674 10.5697 2.17674 9.47448 2.53229C9.19975 2.62146 9.00101 2.8655 8.97268 3.15532C8.65754 6.37738 8.65754 9.62246 8.97268 12.8445C9.00101 13.1343 9.19975 13.3784 9.47448 13.4676C10.5697 13.8231 11.7645 13.8231 12.8598 13.4676C13.1345 13.3784 13.3333 13.1343 13.3616 12.8445Z" fill="white"/>
    </svg>
  );
};

const Play = () => {
  const [isPlay, setIsPlay] = useState<boolean>(false);

  return (
    <IconButton
      margin={'12px 16px'}
      backgroundColor="#722ED1"
      icon={isPlay ? <PauseSvg/> : <PlaySvg/>}
      onClick={(event: any) => {
        setIsPlay(!isPlay);
      }}
    />
  );
};

export default Play;
