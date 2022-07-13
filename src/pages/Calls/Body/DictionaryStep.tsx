import React, { useState, useEffect } from "react";

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

const steps = [
  {
    label: "Редактировать",
    description: <TextareaComponent />,
  },
  {
    label: "Выберите в какой словарь добавить",
    description: "Список словарей"
  },
  {
    label: "Слова в словаре",
    description: "Список слов"
  }
];

function TextareaComponent() {
  const [textareaValue, setTextareaValue] = useState<string>("");

  useEffect(() => {
    const select: any = window.getSelection();
    const selectionText = select.toString().replace(/\s+/g, ' ').trim();

    setTextareaValue(selectionText);
  }, [])

  return (
    <textarea className="dictionary-textarea" name="" id="" value={textareaValue} onChange={event => setTextareaValue(event.target.value)}></textarea>
  )
}
function TextMobileStepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: 400, flexGrow: 1 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          height: 50,
          pl: 2,
          bgcolor: "background.default"
        }}
      >
        <Typography>{steps[activeStep].label}</Typography>
      </Paper>
      <Box sx={{ height: 255, maxWidth: 400, width: "100%", p: 2 }}>
        {steps[activeStep].description}
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Далее
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Назад
          </Button>
        }
      />
    </Box>
  );
}

const DictionaryStep = ({ selectionText, closeDictionaryFunc }: DictionaryStepPropType) => {
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    closeDictionaryFunc();
    setOpen(false);
  };

  useEffect(() => {
    console.log("Test useEffect");
  }, []);

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
        <TextMobileStepper />
      </BootstrapDialog>
    </div>
  );
}


export default DictionaryStep;