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

import { getAllUserDicts, getAllWordInDictionary, updateDict } from "../../../store/calls/calls.slice";
import { langSlice } from "../../../store/lang/lang.slice";
import "../style.css";


interface TextMobileStepperPropType {
  selectedText: string,
  changeSelectedText: any,
  choosedDictId: string,
  setChoosedDictId: any,
  closePopupFunc: any,
}

interface TextareaComponentPropType {
  value: string,
  changeValue: any,
}
interface AllUserDictsComponentPropType {
  allUserDicts: any,
  handleNext: any,
  choosedDictIdFunc: any,
  getAllUserDictsFunc: any,
}
interface AllPhraseInDictComponentPropType {
  phrasesValue: string,
  updatePhrasesValue: any,
  addPhraseFunc: any,
  selectedText: string,
  choosedDictId: string,
  setPhrases: any,
  getAllPhraseInDict: any,
}

const TextareaComponent = ({ value, changeValue }: TextareaComponentPropType) => {
  return (
    <textarea
      className="dictionary-textarea"
      name="selected-text"
      id=""
      value={value}
      onChange={(event) => changeValue(event.target.value)}
    >
    </textarea>
  )
};

const AllUserDictsComponent = ({
  handleNext,
  allUserDicts,
  getAllUserDictsFunc,
  choosedDictIdFunc
}: AllUserDictsComponentPropType) => {

  async function chooseOneDict(id: string) {
    choosedDictIdFunc(id);
    handleNext();
  }

  useEffect(() => {
    getAllUserDictsFunc();
  }, []);

  function renderDicts(item: any) {
    return (
      <div className="dict-item" onClick={() => chooseOneDict(item.id)}>
        <p>{item.title}</p>
      </div>
    )
  }

  return (
    <>
      <Typography sx={{ height: 40, display: 'flex', alignItems: 'center' }}>Выберите словарь: </Typography>
      <div className="dicts-block">
        {
          allUserDicts.length > 0
            ? (
              allUserDicts.map(renderDicts)
            ) : (
              <div className="wait-dicts-loader">
                <CircularProgress />
              </div>
            )
        }
      </div>
    </>
  )
}

const AllPhraseInDictComponent = ({
  phrasesValue,
  updatePhrasesValue,
  choosedDictId,
  getAllPhraseInDict,
  addPhraseFunc,
}: AllPhraseInDictComponentPropType) => {

  useEffect(() => {
    choosedDictId && getAllPhraseInDict();
  }, []);

  return (
    <>
      {
        phrasesValue.length > 0
          ? (
            <textarea
              className="dictionary-textarea phrases-textarea"
              value={phrasesValue}
              onChange={event => updatePhrasesValue(event.target.value)}
            >
            </textarea>
          ) : (
            <div className="wait-dicts-loader">
              <CircularProgress />
            </div>
          )
      }
    </>
  )
}


const TextMobileStepper = ({ selectedText, changeSelectedText, choosedDictId, setChoosedDictId, closePopupFunc }: TextMobileStepperPropType) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [allUserDicts, setAllUserDicts] = useState<any>([]);
  const [phrasesValue, setPhrasesValue] = useState<string>("");
  const [phrases, setPhrases] = useState<any>([]);
  const [newPhrases, setNewPhrases] = useState<any>([]);


  function getPhrasesForTextarea(massive: any) {
    return massive.join(`
`);
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  async function getAllUserDictsFunc() {
    const userDicts = await dispatch(getAllUserDicts());
    // @ts-ignore
    setAllUserDicts(userDicts.payload);
  }

  async function getAllPhraseInDict() {
    const data = await dispatch(getAllWordInDictionary({ id: choosedDictId }));
    // @ts-ignore
    const phrases = data.payload.phrases;
    // @ts-ignore
    phrases.push(selectedText);
    setPhrases(phrases);
    setNewPhrases(phrases.slice(0));
    setPhrasesValue(getPhrasesForTextarea(phrases));
  }

  function updatePhrasesValue(value: string) {
    const newValue = value.split(`
`);
    setPhrasesValue(getPhrasesForTextarea(newValue));
  }

  function addPhrase() {
    newPhrases.push(selectedText);
    setPhrasesValue(getPhrasesForTextarea(newPhrases));
    handleNext();
  }

  function rescindChangesFunc() {
    setNewPhrases(phrases.slice(0));
    setPhrasesValue(getPhrasesForTextarea(phrases));
    handleBack();
  }

  const steps = [
    // {
    //   label: "Редактировать",
    //   description: <TextareaComponent value={selectedText} changeValue={changeSelectedText} />,
    // },
    {
      label: "Редактировать выделенное слово:",
      description: (
        <>
          <TextareaComponent value={selectedText} changeValue={changeSelectedText} />
          <AllUserDictsComponent
            handleNext={handleNext}
            choosedDictIdFunc={setChoosedDictId}
            allUserDicts={allUserDicts}
            getAllUserDictsFunc={getAllUserDictsFunc}
          />
        </>
      ),
    },
    {
      label: `Добавляем в словарь: "${selectedText}"`,
      description:
        <AllPhraseInDictComponent
          phrasesValue={phrasesValue}
          updatePhrasesValue={updatePhrasesValue}
          addPhraseFunc={addPhrase}
          getAllPhraseInDict={getAllPhraseInDict}
          selectedText={selectedText}
          choosedDictId={choosedDictId}
          setPhrases={setPhrases}
        />,
    },
  ];

  async function sendNewPhraseToDict() {
    const sendPhrases = phrasesValue.split(`
`);

    const data = await dispatch(updateDict({
      dictId: choosedDictId,
      phrases: sendPhrases,
    }));
    closePopupFunc();

    // @ts-ignore
    if (data.payload < 300) {
      dispatch(langSlice.actions.setSnackbar({
        type: "success",
        text: "Словарь успешно обновлён",
        value: true,
        time: 2000
      }));
    } else {
      dispatch(langSlice.actions.setSnackbar({
        type: "error",
        text: "Произошла какая-то ошибка. Попробуйте позже",
        value: true,
        time: 2000
      }));
    }
  }

  const maxSteps = steps.length;

  return (
    <Box sx={{ width: 500, flexGrow: 1 }} className="popup-stepper-content">
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
      <Box sx={{ height: 255, width: "100%", p: 2, paddingTop: "0px" }}>
        {steps[activeStep].description}
      </Box>
      <div className="menu-stepper">
        <div className="left-block">
          {
            activeStep > 0 && (
              <Button size="small" onClick={handleBack}>
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Назад
              </Button>
            )
          }
          {/* {
            activeStep === 0
              ? (
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  Отправить в словарь
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              ) : activeStep === 2 ? (
                <Button
                  size="small"
                  onClick={addPhrase}
                >
                  Добавить
                </Button>
              ) : activeStep === 2 && (
                <>
                  <Button
                    size="small"
                    onClick={rescindChangesFunc}
                  >
                    Отмена
                  </Button>
                  <Button
                    size="small"
                    onClick={sendNewPhraseToDict}
                  >
                    Отправить
                  </Button>
                </>
              )
          } */}
        </div>
        <div className="right-block">
          {
            activeStep === 1 && (
              <Button
                size="small"
                onClick={sendNewPhraseToDict}
              >
                Добавить в словарь
              </Button>
            )
          }
        </div>
      </div>
    </Box>
  );
}

export default TextMobileStepper;