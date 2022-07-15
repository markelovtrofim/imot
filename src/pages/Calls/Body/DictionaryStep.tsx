/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CircularProgress from '@mui/material/CircularProgress';

import { getAllUserDicts, getAllWordInDictionary } from "../../../store/calls/calls.slice";
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
interface TextMobileStepperPropType {
  selectedText: string,
  changeSelectedText: any,
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
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <TextMobileStepper
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
