import React from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export function SortedDescendingIcon() {
  return <ExpandMoreIcon className="icon" />;
}

export function SortedAscendingIcon() {
  return <ExpandLessIcon className="icon" />;
}

export const ExportIcon = (props: any) => {
  return(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={props.style}>
      <path d="M13.35 9.39611C13.2952 9.44451 13.2621 9.51298 13.2585 9.58605C13.2261 10.2611 13.1707 10.9354 13.0921 11.6076C12.9893 12.486 12.279 13.1858 11.3922 13.2848C9.15505 13.5349 6.84064 13.5349 4.60343 13.2848C3.71669 13.1858 3.00636 12.486 2.90361 11.6076C2.63629 9.32185 2.63629 7.01285 2.90361 4.72713C3.00636 3.84869 3.71669 3.14894 4.60343 3.04983C6.07844 2.88498 7.58877 2.82889 9.08683 2.88142C9.19497 2.88521 9.28703 2.80291 9.29463 2.69493L9.32738 2.22625C9.32938 2.19865 9.3321 2.17135 9.3355 2.14436C9.35177 2.01477 9.26191 1.88698 9.13138 1.88236C7.58098 1.82743 6.01967 1.88533 4.49235 2.05603C3.15097 2.20594 2.06809 3.26261 1.91039 4.61097C1.63403 6.97385 1.63403 9.36085 1.91039 11.7237C2.06809 13.072 3.15097 14.1288 4.49235 14.2786C6.80337 14.537 9.1923 14.537 11.5033 14.2786C12.8447 14.1288 13.9275 13.072 14.0853 11.7237C14.1979 10.7605 14.2647 9.79331 14.2855 8.82531C14.2881 8.70385 14.1391 8.64331 14.0537 8.72985C13.827 8.96005 13.5923 9.18225 13.35 9.39611Z" fill="#A3AEBE"/>
      <path d="M5.2448 10.3666C5.09732 10.326 4.99642 10.1902 5.0001 10.0373L5.03959 8.39467C5.09614 6.04271 7.01899 4.16551 9.37166 4.16551H10.2099C10.2275 3.74969 10.2514 3.33407 10.2817 2.9188L10.3269 2.29837C10.3545 1.91975 10.7767 1.70809 11.0965 1.9125C12.4772 2.79469 13.6775 3.93142 14.6333 5.26209L14.9374 5.68539C15.0209 5.8016 15.0209 5.95812 14.9374 6.07433L14.6333 6.49763C13.6775 7.82827 12.4772 8.96501 11.0965 9.84721C10.8331 10.0155 10.4993 9.90174 10.3747 9.64487C10.3485 9.59027 10.3317 9.52734 10.3269 9.46134L10.2817 8.84094C10.2455 8.34567 10.2185 7.84994 10.2005 7.35394L9.96446 7.31841C8.46032 7.09201 6.97252 7.81787 6.2252 9.14267L5.62366 10.2091C5.59501 10.2598 5.55435 10.3009 5.50712 10.3297C5.43048 10.3765 5.33598 10.3917 5.2448 10.3666Z" fill="#738094"/>
    </svg>
  )
}

export const OnTopArrow = (props: any) => {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg" style={props.style}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M7.39101 4.59994C7.17176 4.83662 6.81636 4.83662 6.59711 4.59994L3.9999 1.79621L1.40271 4.59994C1.18347 4.83662 0.828006 4.83662 0.608766 4.59994C0.389526 4.36325 0.389526 3.97957 0.608766 3.74288L3.60295 0.510518C3.8222 0.273838 4.1776 0.273838 4.39685 0.510518L7.39101 3.74288C7.61026 3.97957 7.61026 4.36325 7.39101 4.59994Z"
        fill="#1B202B"/>
    </svg>
  );
};

export const OnBottomArrow = (props: any) => {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg" style={props.style}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M7.39101 0.400166C7.61026 0.636846 7.61026 1.02059 7.39101 1.25725L4.39685 4.48958C4.1776 4.72627 3.8222 4.72627 3.60295 4.48958L0.608766 1.25725C0.389526 1.02059 0.389526 0.636846 0.608766 0.400166C0.828006 0.163486 1.18347 0.163486 1.40271 0.400166L3.9999 3.20392L6.59711 0.400166C6.81636 0.163486 7.17176 0.163486 7.39101 0.400166Z"
        fill="#738094"/>
    </svg>
  );
};

export const TrashSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.9375 2.25C6.9375 1.93934 7.18934 1.6875 7.5 1.6875H10.5C10.8106 1.6875 11.0625 1.93934 11.0625 2.25V2.8125H14.25C14.5606 2.8125 14.8125 3.06434 14.8125 3.375C14.8125 3.68566 14.5606 3.9375 14.25 3.9375H3.75C3.43934 3.9375 3.1875 3.68566 3.1875 3.375C3.1875 3.06434 3.43934 2.8125 3.75 2.8125H6.9375V2.25Z"
        fill="#F5222D"/>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M4.68118 5.95858C4.70227 5.76868 4.8628 5.625 5.05388 5.625H12.9487C13.1397 5.625 13.3003 5.76868 13.3213 5.95858L13.4714 7.3096C13.742 9.74483 13.742 12.2026 13.4714 14.6378L13.4566 14.7708C13.3581 15.6577 12.6707 16.3649 11.787 16.4887C9.93883 16.7474 8.06368 16.7474 6.21556 16.4887C5.33178 16.3649 4.64439 15.6577 4.54584 14.7708L4.53106 14.6378C4.26048 12.2026 4.26048 9.74483 4.53106 7.3096L4.68118 5.95858ZM8.06375 8.55C8.06375 8.23935 7.8119 7.9875 7.50125 7.9875C7.19059 7.9875 6.93875 8.23935 6.93875 8.55V13.8C6.93875 14.1107 7.19059 14.3625 7.50125 14.3625C7.8119 14.3625 8.06375 14.1107 8.06375 13.8V8.55ZM11.0638 8.55C11.0638 8.23935 10.8119 7.9875 10.5013 7.9875C10.1906 7.9875 9.93875 8.23935 9.93875 8.55V13.8C9.93875 14.1107 10.1906 14.3625 10.5013 14.3625C10.8119 14.3625 11.0638 14.1107 11.0638 13.8V8.55Z"
        fill="#FF4D4F"/>
    </svg>
  );
};

export const CaretDownSvg = (props: any) => {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={props.style}>
      <path fillRule="evenodd" clipRule="evenodd" d="M14.401 30.0009C13.7159 29.2613 13.7159 28.0621 14.401 27.3226L23.7578 17.2215C24.4429 16.4819 25.5536 16.4819 26.2387 17.2215L35.5955 27.3226C36.2807 28.0621 36.2807 29.2613 35.5955 30.0009C34.9104 30.7406 33.7996 30.7406 33.1144 30.0009L24.9982 21.2392L16.882 30.0009C16.1968 30.7406 15.0862 30.7406 14.401 30.0009Z" fill="#738094"/>
    </svg>
  );
};

export const PlusSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M5.99941 0C6.43163 0 6.78201 0.350386 6.78201 0.782609V11.2174C6.78201 11.6496 6.43163 12 5.99941 12C5.56718 12 5.2168 11.6496 5.2168 11.2174V0.782609C5.2168 0.350386 5.56718 0 5.99941 0Z"
        fill="#722ED1"/>
      <path fillRule="evenodd" clipRule="evenodd"
        d="M0 6.00038C0 5.56816 0.350386 5.21777 0.782609 5.21777H11.2174C11.6496 5.21777 12 5.56816 12 6.00038C12 6.4326 11.6496 6.78299 11.2174 6.78299H0.782609C0.350386 6.78299 0 6.4326 0 6.00038Z"
        fill="#722ED1"/>
    </svg>
  );
};

export const InfoCircle = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11.916 2.66602C6.80787 2.66602 2.66602 6.80787 2.66602 11.916C2.66602 17.0242 6.80787 21.166 11.916 21.166C17.0242 21.166 21.166 17.0242 21.166 11.916C21.166 6.80787 17.0242 2.66602 11.916 2.66602ZM11.916 19.5968C7.67506 19.5968 4.23521 16.157 4.23521 11.916C4.23521 7.67506 7.67506 4.23521 11.916 4.23521C16.157 4.23521 19.5968 7.67506 19.5968 11.916C19.5968 16.157 16.157 19.5968 11.916 19.5968Z"
        fill="#738094" />
      <path
        d="M10.666 7.85649C10.666 8.17223 10.7914 8.47503 11.0147 8.69829C11.238 8.92154 11.5408 9.04697 11.8565 9.04697C12.1722 9.04697 12.475 8.92154 12.6983 8.69829C12.9215 8.47503 13.047 8.17223 13.047 7.85649C13.047 7.54076 12.9215 7.23796 12.6983 7.0147C12.475 6.79144 12.1722 6.66602 11.8565 6.66602C11.5408 6.66602 11.238 6.79144 11.0147 7.0147C10.7914 7.23796 10.666 7.54076 10.666 7.85649ZM12.6501 11.4279C12.6501 10.9896 12.2948 10.6343 11.8565 10.6343C11.4182 10.6343 11.0628 10.9896 11.0628 11.4279C11.0628 11.7747 11.0628 12.1148 11.0628 12.166V16.1921C11.0628 16.2446 11.0628 16.6143 11.0628 16.9835C11.0628 17.4218 11.4182 17.7771 11.8565 17.7771C12.2948 17.7771 12.6501 17.4218 12.6501 16.9835C12.6501 16.6143 12.6501 16.2446 12.6501 16.1921V12.166C12.6501 12.1148 12.6501 11.7747 12.6501 11.4279Z"
        fill="#738094" />
    </svg>
  );
};