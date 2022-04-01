import React, {FC, useEffect, useState} from 'react';
import {InputBase, Typography} from "@mui/material";
import Checkbox from "../../../../components/Checkbox";
import Switch from "../../../../components/Switch";
import CustomControlSelect from "../../../../components/Selects/CustomControlSelect";
import {InfoCircleActive, Preloader} from "../../index";
import {useAppSelector} from "../../../../hooks/redux";
import Field from "../../../../components/FIeld";
import {makeStyles} from "@mui/styles";
import {useFormik} from "formik";
import {LoadingButton} from "@mui/lab";
import {useDispatch} from "react-redux";
import {getGroups, updateDict} from "../../../../store/dicts/dicts.slice";
import ModalWindow from "../../../../components/ModalWindowBox";
import {Input} from "../../../../components";

type DictDetailsPropsType = {
  alignment: string
};

const DictDetails: FC<DictDetailsPropsType> = ({alignment}) => {
  const useStyles = makeStyles(({
    ddTextarea: {
      minHeight: '340px',
      minWidth: '100%',
      resize: 'none',
      backgroundColor: '#F8FAFC',
      color: '#2F3747',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      border: 'none',
      outline: 'none',
      lineHeight: '25px',
      '&::-webkit-scrollbar': {
        width: '4px',
        outline: 'none',
        background: '#CDD5DF'
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#A3AEBE',
        height: '50px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#9298A1'
      }
    }
  }));
  const classes = useStyles();
  const currentDict = useAppSelector(state => state.dicts.currentDict);
  const loading = useAppSelector(state => state.dicts.loading.itemDetailsBlockLoading);

  useEffect(() => {
    if (currentDict) {
      formik.values.title = currentDict.title;
      formik.values.phrases = currentDict.phrases.join("\n");
      formik.values.groupName = currentDict.group;
    }
  }, [currentDict]);

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      title: currentDict ? currentDict.title : '',
      phrases: currentDict ? currentDict.phrases.join("\n") : '',
      groupName: currentDict ? currentDict.group : ''
    },
    onSubmit: async (values) => {
      const phrasesParseToObject = () => {
        const phrasesArray = values.phrases.split('\n');
        let phrasesArrayNew = [];
        for (let i = 0; i < phrasesArray.length; i++) {
          if (phrasesArray[i].length > 1) {
            phrasesArrayNew.push(phrasesArray[i]);
          }
        }
        return phrasesArrayNew;
      }
      if (currentDict) {
        await dispatch(updateDict({...currentDict, phrases: phrasesParseToObject(), title: values.title, group: values.groupName}));
        dispatch(getGroups());
      }
    },
  });


  return (
    <div>
      {/* Словари */}
      {loading ? <Preloader/> :
        <div>
          {alignment === 'dictionaries' && currentDict ?
            <div>
              <form onSubmit={formik.handleSubmit}>
                <Field label={'Название словаря'}>
                  <InputBase
                    disabled={!currentDict.enabled}
                    style={{width: '100%'}}
                    name="title"
                    type="text"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                  />
                </Field>
                <Field label={'Название группы'}>
                  <InputBase
                    disabled={!currentDict.enabled || !Boolean(formik.values.groupName)}
                    style={{width: '100%'}}
                    name="groupName"
                    type="text"
                    value={formik.values.groupName ? formik.values.groupName : 'Группа создана автоматически, нельзя изменить название'}
                    onChange={formik.handleChange}
                  />
                </Field>
                <Field label={'Список слов, фраз'} labelBrother={<InfoCircleActive/>}>
                <textarea
                  className={classes.ddTextarea}
                  disabled={!currentDict.enabled}
                  onChange={formik.handleChange}
                  value={formik.values.phrases}
                  name="phrases"
                />
                </Field>

                <div style={{marginTop: '24px'}}>
                  <Typography>Правила</Typography>

                  {/* Checkbox block */}
                  <div style={{margin: '18px 0 24px 0'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                      <Checkbox style={{marginRight: '8px'}}/>
                      <Typography>Словарь автозамены</Typography>
                    </div>
                  </div>

                  <div style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <Switch/>
                      <Typography>Активированно</Typography>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <LoadingButton type={"submit"} style={{marginRight: '24px'}}
                                     variant={"contained"}>Сохранить</LoadingButton>
                      <CustomControlSelect
                        svg={'horizontal'}
                        handleSelectChange={() => {
                          return null;
                        }}
                      />
                    </div>
                  </div>
                </div>
              </form>

            </div> : <Typography variant={'h3'}>Пусто</Typography>
          }</div>}
    </div>
  );
};

export default DictDetails;