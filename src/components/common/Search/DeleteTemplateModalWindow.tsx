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
import {deleteTemplate, templateSlice, updateTemplate} from "../../../store/search/template.slice";
import {searchSlice} from "../../../store/search/search.slice";
import {TemplateType} from "../../../store/search/template.types";
import Snackbar from "../Snackbar";

const useStyles = makeStyles(({
  mwTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  mwTitleText: {
    fontWeight: '700 !important'
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
  currentTemplate: TemplateType | null
};

const CreateNameTemplateModalWindow: FC<CreateNameTemplateMWPropsType> = ({
                                                                            isOpen,
                                                                            handleClose,
                                                                            currentTemplate
                                                                          }) => {
  const allTemplates = useAppSelector(state => state.template.allTemplates);
  const dispatch = useDispatch();
  const getTemplate = () => {
    if (allTemplates && currentTemplate) {
      return allTemplates.find((item) => {
        return item.title === currentTemplate.title;
      });
    }
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      const template = getTemplate();
      if (template) {
        setLoading(true);
        await dispatch(deleteTemplate(template.id));
        dispatch(templateSlice.actions.setCurrentTemplate(null));
        dispatch(searchSlice.actions.setClearDefaultCriteriasValues(null));
        dispatch(searchSlice.actions.removeAllActiveCriterias(null));
        handleClose();
        setLoading(false);
        setSnackbar(true);
      }
    },
  });
  const classes = useStyles();

  useEffect(() => {
    return () => {
      setSnackbar(false);
    }
  }, [])

  return (
    <div>
      <Snackbar
        type={'success'}
        open={snackbar}
        onClose={() => {
          setSnackbar(false);
        }}
        text={'Шаблон удален'}
        time={2000}
      />
      
      <ModalWindowBox isOpen={isOpen} handleClose={handleClose}>
        <div className={classes.mwTitle}>
          <Typography className={cn(classes.mwTitleText, classes.mwText)}>
            Вы уверены, что хотите удалить шаблон?
          </Typography>
          <IconButton className={classes.mwIconButton} onClick={handleClose}>
            <CloseIcon style={{color: '#000000', width: '15px', height: '15px'}}/>
          </IconButton>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className={classes.mwButtonBox}>
            <LoadingButton loading={loading} type="submit" style={{marginRight: '15px'}} variant="contained" color="error">
              Удалить
            </LoadingButton>
            <LoadingButton onClick={handleClose} variant="contained" color="secondary">
              Отмена
            </LoadingButton>
          </div>
        </form>
      </ModalWindowBox>
    </div>
  );
};

export default CreateNameTemplateModalWindow;
