import React, { useState } from "react";

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

  return (
    <div className="dictionary-popup" style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }} >
      <Paper>
        <MenuList>
          {/* @ts-ignore */}
          <textarea className="dictionary-textarea" name="" id="" value={textareaValue} onChange={event => setTextareaValue(event.target.value)}></textarea>
          <MenuItem>My account</MenuItem>
          <MenuItem>Logout</MenuItem>
        </MenuList>
      </Paper>
    </div >
  )
}


export default DictionaryPopup;