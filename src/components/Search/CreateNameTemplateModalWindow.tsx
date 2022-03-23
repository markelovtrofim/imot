import React, {FC, useState} from 'react';
import {IconButton, Typography} from "@mui/material";
import {ModalWindowBox} from "../index";
import cn from "classnames";
import CloseIcon from "@mui/icons-material/Close";
import Input from "../Input";
import {LoadingButton} from "@mui/lab";
import {useFormik} from "formik";
import {makeStyles} from "@mui/styles";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../hooks/redux";
import {createTemplate, updateTemplate} from "../../store/search/template.slice";
import {TemplateType} from "../../store/search/template.types";

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
    textAlign: 'right'
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

  const validate = (values: {name: string}) => {
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
      debugger
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
    },
  });
  const classes = useStyles();
  return (
    <ModalWindowBox isOpen={isOpen} handleClose={handleClose}>
      <div className={classes.mwTitle}>
        <Typography className={cn(classes.mwTitleText, classes.mwText)}>Введите имя шаблона</Typography>
        <IconButton className={classes.mwIconButton} onClick={handleClose}>
          <CloseIcon style={{color: '#000000', width: '15px', height: '15px'}}/>
        </IconButton>
      </div>
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
        <div className={classes.mwButtonBox}>
          <LoadingButton disabled={disabled} type="submit" variant="contained" color="primary">
            Сохранить
          </LoadingButton>
        </div>
      </form>
    </ModalWindowBox>
  );
};

export default CreateNameTemplateModalWindow;