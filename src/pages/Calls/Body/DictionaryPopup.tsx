import React, { useState, useEffect, useRef } from "react";

import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import "../style.css";


interface DictionaryPopupPropType {
  popupPosition: {
    top: number | undefined,
    left: number | undefined,
  },
  selectionText: string,
}
const DictionaryPopup = ({ popupPosition, selectionText }: DictionaryPopupPropType) => {
  const [textareaValue, setTextareaValue] = useState<string>(selectionText);
  const popupRef = React.createRef();

  function chooseDictionary() {
    console.log("Список словарей: ");
  }
  function closePopup() {
    console.log("Закрыть");
  }

  useEffect(() => {
    // popupRef.current?.focus();
  }, []);

  return (
    <div 
      className="dictionary-popup" 
      style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }} 
      onBlur={closePopup}
    >
      <Paper>
        <MenuList>
          {/* @ts-ignore */}
          <p className="dictionary-textarea-title">Редактировать</p>
          <textarea className="dictionary-textarea" name="" id="" value={textareaValue} onChange={event => setTextareaValue(event.target.value)}></textarea>
          <MenuItem onClick={chooseDictionary}>Отправить в словарь</MenuItem>
        </MenuList>
      </Paper>
    </div>
  )
}


export default DictionaryPopup;