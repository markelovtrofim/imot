/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import TextMobileStepper from "./TextMobileStepper";
import "../style.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

interface DictionaryStepPropType {
  selectionText: string,
  closeDictionaryFunc: any,
}

const DictionaryStep = ({ selectionText, closeDictionaryFunc }: DictionaryStepPropType) => {
  const [open, setOpen] = useState<boolean>(true);
  const [selectedText, setSelectedText] = useState<string>(selectionText);
  const [choosedDictId, setChoosedDictId] = useState<string>("");

  const handleClose = () => {
    closeDictionaryFunc();
    setOpen(false);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <TextMobileStepper
          closePopupFunc={handleClose}
          selectedText={selectedText}
          changeSelectedText={setSelectedText}
          choosedDictId={choosedDictId}
          setChoosedDictId={setChoosedDictId}
        />
      </BootstrapDialog>
    </div>
  );
}


export default DictionaryStep;
