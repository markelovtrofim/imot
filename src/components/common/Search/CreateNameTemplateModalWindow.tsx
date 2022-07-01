import React, {FC, useEffect, useState} from 'react';
import {IconButton, Typography} from "@mui/material";
import {ModalWindowBox} from "../index";
import cn from "classnames";
import CloseIcon from "@mui/icons-material/Close";
import Input from "../Input";
import {LoadingButton} from "@mui/lab";
import {useFormik} from "formik";
import {makeStyles} from "@mui/styles";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../../hooks/redux";
import {createTemplate, updateTemplate} from "../../../store/search/template.slice";
import {TemplateType} from "../../../store/search/template.types";
import Snackbar from "../Snackbar";
import {translate} from "../../../localizations";

const useStyles = makeStyles(({
  mwTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  mwTitleText: {
    fontWeight: '700 !important',
  },
  mwIconButton: {},
  mwText: {
    color: "#738094 !important",
  },
  mwHelp: {
    marginBottom: '35px !important'
  },
  mwButtonBox: {
    marginTop: '25px',
    textAlign: 'right',
    '& .MuiButton-contained': {
      textTransform: 'none !important'
    },
    '& .MuiButton-contained.Mui-disabled': {
      backgroundColor: 'rgba(114, 46, 209, 0.3)',
      color: '#fff !important'
    }
  }
}));

type CreateNameTemplateMWPropsType = {
  isOpen: boolean,
  handleClose: () => void,
  method: 'post' | 'put' | null,
  currentTemplate: TemplateType | null
};

const CreateNameTemplateModalWindow: FC<CreateNameTemplateMWPropsType> = ({
                                                                            isOpen, handleClose,
                                                                            method,
                                                                            currentTemplate
                                                                          }) => {

  const activeCriterias = useAppSelector(state => state.search.activeCriterias);
  const defaultCriterias = useAppSelector(state => state.search.defaultCriterias);
  const dispatch = useDispatch();

  const [disabled, setDisabled] = useState<boolean>(true);

  const validate = (values: { name: string }) => {
    if (values.name.length < 1) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: ''
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      if (method === 'put' && currentTemplate) {
        await dispatch(updateTemplate({...currentTemplate, title: values.name}));
        handleClose();
        values.name = '';
      }
      if (method === 'post') {
        const localDefaultCriterias = [];
        for (let i = 0; i < defaultCriterias.length; i++) {
          if (defaultCriterias[i].values.length > 0) {
            localDefaultCriterias.push(defaultCriterias[i])
          }
        }
        await dispatch(createTemplate({
          title: values.name,
          items: [...localDefaultCriterias, ...activeCriterias]
        }));
        handleClose();
        values.name = '';
      }
      setSnackbar(true);
      setLoading(false);
      setDisabled(true);
    },
  });
  const classes = useStyles();

  const {language} = useAppSelector(state => state.lang);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<boolean>(false);

  return (
    <div>
      <Snackbar
        type={'success'}
        open={snackbar}
        onClose={() => {
          setSnackbar(false);
        }}
        text={method === 'put' ? 'Имя шаблона изменено' : 'Новый шаблон создан'}
        time={2000}
      />

      <ModalWindowBox
        isMWOpen={isOpen}
        handleMWClose={handleClose}

        text={"Введите имя шаблона"}
      >
        <form onSubmit={formik.handleSubmit}>
          <Input
            name={"name"}
            type={"text"}
            handleChange={formik.handleChange}
            value={formik.values.name}
            bcColor={"#EEF2F6"}
            label={"Название"}
            autoComplete="off"
          />

          {/* Кнопоньки */}
          <LoadingButton
            loading={loading}
            style={{marginRight: '15px'}}
            variant="contained"
            type="submit"
            color={"primary"}
          >
            {translate("sendButton", language)}
          </LoadingButton>

        </form>
      </ModalWindowBox>
    </div>
  );
};

export default CreateNameTemplateModalWindow;