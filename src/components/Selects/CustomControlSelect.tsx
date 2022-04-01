import React, {FC} from 'react';
import Select, {components} from "react-select";

// SVG BLOCK
const VerticalDotsSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="21" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8.36743 2.68359C7.69851 2.68359 7.15625 3.22588 7.15625 3.89477C7.15625 4.56367 7.69851 5.10595 8.36743 5.10595C9.03635 5.10595 9.57861 4.56367 9.57861 3.89477C9.57861 3.22588 9.03635 2.68359 8.36743 2.68359Z"
        fill="#2F3747"/>
      <path
        d="M7.15625 9.00024C7.15625 8.33135 7.69854 7.78906 8.36743 7.78906C9.03632 7.78906 9.57861 8.33135 9.57861 9.00024C9.57861 9.66914 9.03632 10.2114 8.36743 10.2114C7.69854 10.2114 7.15625 9.66914 7.15625 9.00024Z"
        fill="black"/>
      <path
        d="M7.15625 14.1057C7.15625 13.4368 7.69854 12.8945 8.36743 12.8945C9.03632 12.8945 9.57861 13.4368 9.57861 14.1057C9.57861 14.7746 9.03632 15.3169 8.36743 15.3169C7.69854 15.3169 7.15625 14.7746 7.15625 14.1057Z"
        fill="black"/>
    </svg>
  )
};

const HorizontalDotsSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="20" height="20 " viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 7C3.44771 7 3 7.44773 3 8C3 8.55227 3.44771 9 4 9C4.55229 9 5 8.55227 5 8C5 7.44773 4.55229 7 4 7Z"
            fill="black"/>
      <path d="M7 8C7 7.44773 7.44773 7 8 7C8.55227 7 9 7.44773 9 8C9 8.55227 8.55227 9 8 9C7.44773 9 7 8.55227 7 8Z"
            fill="black"/>
      <path
        d="M11 8C11 7.44773 11.4477 7 12 7C12.5523 7 13 7.44773 13 8C13 8.55227 12.5523 9 12 9C11.4477 9 11 8.55227 11 8Z"
        fill="black"/>
    </svg>
  )
};


const PenSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9.73764 2.33301C9.82604 2.33301 9.91084 2.36813 9.97338 2.43064L11.859 4.31625C11.9891 4.44643 11.9891 4.65749 11.859 4.78766L5.7307 10.9159C5.68882 10.9578 5.63654 10.9877 5.57924 11.0027L3.02696 11.6694C2.91246 11.6993 2.79069 11.6663 2.70702 11.5826C2.62334 11.4989 2.5903 11.3771 2.6202 11.2627L3.28687 8.71034C3.30184 8.65307 3.3318 8.60081 3.37368 8.55888L9.50191 2.43064C9.56444 2.36813 9.64924 2.33301 9.73764 2.33301Z"
        fill="black"/>
      <path
        d="M2.66797 12.833C2.39183 12.833 2.16797 13.0569 2.16797 13.333C2.16797 13.6091 2.39183 13.833 2.66797 13.833H12.668C12.9441 13.833 13.168 13.6091 13.168 13.333C13.168 13.0569 12.9441 12.833 12.668 12.833H2.66797Z"
        fill="black"/>
    </svg>
  );
};

const TrashSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.16536 2C6.16536 1.72386 6.38922 1.5 6.66536 1.5H9.33203C9.60816 1.5 9.83203 1.72386 9.83203 2V2.5H12.6654C12.9415 2.5 13.1654 2.72386 13.1654 3C13.1654 3.27614 12.9415 3.5 12.6654 3.5H3.33203C3.05589 3.5 2.83203 3.27614 2.83203 3C2.83203 2.72386 3.05589 2.5 3.33203 2.5H6.16536V2Z"
        fill="#F5222D"/>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M4.16148 5.29652C4.18023 5.12771 4.32292 5 4.49277 5H11.5103C11.6801 5 11.8229 5.12771 11.8416 5.29652L11.975 6.49742C12.2155 8.66207 12.2155 10.8467 11.975 13.0113L11.9619 13.1296C11.8743 13.9179 11.2633 14.5466 10.4777 14.6566C8.83495 14.8866 7.16815 14.8866 5.52537 14.6566C4.73979 14.5466 4.12878 13.9179 4.04118 13.1296L4.02805 13.0113C3.78753 10.8467 3.78753 8.66207 4.02805 6.49742L4.16148 5.29652ZM7.16821 7.6C7.16821 7.32387 6.94435 7.1 6.66821 7.1C6.39207 7.1 6.16821 7.32387 6.16821 7.6V12.2667C6.16821 12.5428 6.39207 12.7667 6.66821 12.7667C6.94435 12.7667 7.16821 12.5428 7.16821 12.2667V7.6ZM9.83488 7.6C9.83488 7.32387 9.61101 7.1 9.33488 7.1C9.05875 7.1 8.83488 7.32387 8.83488 7.6V12.2667C8.83488 12.5428 9.05875 12.7667 9.33488 12.7667C9.61101 12.7667 9.83488 12.5428 9.83488 12.2667V7.6Z"
            fill="#F5222D"/>
    </svg>
  );
};

// TYPES BLOCK
type CustomControlSelectPropsType = {
  handleSelectChange: (event: any) => void,
  svg: 'horizontal' | 'vertical'
};

const CustomControlSelect: FC<CustomControlSelectPropsType> = ({handleSelectChange, svg}) => {
  // STYLES BLOCK
  const customDotsStyles = {
    menu: (provided: any, state: any) => ({
      ...provided,
      width: '183px',
      right: '0',
      cursor: 'pointer',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      color: '#000',
    }),
    option: (provided: any, state: any) => ({
      cursor: 'pointer',
      padding: '10px 24px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      color: '#000',
      "&:hover": {
        backgroundColor: '#F8FAFC',
        color: '#722ED1'
      }
    }),
    menuList: (provided: any, state: any) => ({
      padding: '0'
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      cursor: 'pointer',
      width: '40px',
      height: '40px',
      border: 'none',
      boxShadow: 'none',
      backgroundColor: '#E3E8EF',
      borderRadius: '5px',
      justifyContent: 'center',
      display: 'flex'
    }),
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      position: 'absolute',
      zIndex: '1'
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      zIndex: '2'
    })
  };

  const CustomOption: FC<any> = ({data, children, ...props}) => {
    if (data.value === 'rename') {
      return (
        <components.Option {...props}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <PenSvg/>
            <div style={{color: '#000', marginLeft: '10px', fontWeight: '700'}}>{data.label}</div>
          </div>
        </components.Option>
      )
    } else {
      return (
        <components.Option {...props}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <TrashSvg/>
            <div style={{color: '#F5222D', marginLeft: '10px', fontWeight: '700'}}>{data.label}</div>
          </div>
        </components.Option>
      )
    }
  };

  return (
    <Select
      styles={customDotsStyles}
      placeholder={''}
      isSearchable={false}
      components={{
        DropdownIndicator: () => svg === 'horizontal' ? <HorizontalDotsSvg/> : <VerticalDotsSvg/>,
        IndicatorSeparator: () => null,
        SingleValue: () => null,
        Option: CustomOption
      }}
      onChange={handleSelectChange}
      options={[
        {value: 'rename', label: 'Переименовать'},
        {value: 'delete', label: 'Удалить'}
      ]}
    />
  );
};

export default CustomControlSelect;