import React, {FC, useEffect, useState} from 'react';
import {InputBase, Skeleton, Typography} from "@mui/material";
import Checkbox from "../../../../components/Checkbox";
import Switch from "../../../../components/Switch";
import CustomControlSelect from "../../../../components/Selects/CustomControlSelect";
import {InfoCircleActive} from "../../index";
import {useAppSelector} from "../../../../hooks/redux";
import Field from "../../../../components/FIeld";
import {makeStyles} from "@mui/styles";
import {useFormik} from "formik";
import {LoadingButton} from "@mui/lab";
import {useDispatch} from "react-redux";
import {deleteDict, getGroups, updateDict} from "../../../../store/dicts/dicts.slice";

const DictDetails: FC = () => {
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
  const nadoUbrat = useAppSelector(state => state.dicts.loading.itemDetailsBlockLoading);

  useEffect(() => {
    debugger
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
      setLoading(true);
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
        await dispatch(updateDict({
          ...currentDict,
          phrases: phrasesParseToObject(),
          title: values.title,
          group: values.groupName
        }));
        await dispatch(getGroups());
        setLoading(false);
      }
    },
  });
  console.log(formik.values.title);

  const createSelectOptions = () => {
    if (currentDict) {
      if (!currentDict.enabled) {
        return [
          {value: 'delete', label: 'Удалить'},
          {value: 'clone', label: 'Склонировать'},
        ];
      } else {
        return [
          {value: 'delete', label: 'Удалить'}
        ];
      }
    } else {
      return []
    }
  };

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <Field label={'Название словаря'}>
            {currentDict
              ? <InputBase
                disabled={!currentDict.enabled}
                style={{width: '100%'}}
                name="title"
                type="text"
                value={formik.values.title}
                onChange={formik.handleChange}
              />
              : <Skeleton variant={"text"} height={'18px'} width={'100%'}/>
            }
          </Field>
          <Field label={'Название группы'}>
            {currentDict
              ? <InputBase
                disabled={!currentDict.enabled || !Boolean(formik.values.groupName)}
                style={{width: '100%'}}
                name="groupName"
                type="text"
                value={formik.values.groupName ? formik.values.groupName : 'Группа создана автоматически, нельзя изменить название'}
                onChange={formik.handleChange}
              />
              : <Skeleton variant={"text"} height={'18px'} width={'100%'}/>
            }
          </Field>
          <Field label={'Список слов, фраз'} labelBrother={<InfoCircleActive/>}>
            {currentDict
              ? <textarea
                className={classes.ddTextarea}
                disabled={!currentDict.enabled}
                onChange={formik.handleChange}
                value={formik.values.phrases}
                name="phrases"
              />
              : <div style={{height: '340px'}}>
                <Skeleton variant={"text"} height={'20px'} width={'150px'}/>
                <Skeleton variant={"text"} height={'20px'} width={'150px'}/>
                <Skeleton variant={"text"} height={'20px'} width={'150px'}/>
                <Skeleton variant={"text"} height={'20px'} width={'150px'}/>
                <Skeleton variant={"text"} height={'20px'} width={'150px'}/>
                <Skeleton variant={"text"} height={'20px'} width={'150px'}/>
              </div>
            }
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
                <LoadingButton
                  type={"submit"}
                  style={{marginRight: '24px'}}
                  variant={"contained"}
                  loading={loading}
                >
                  Сохранить
                </LoadingButton>
                <CustomControlSelect
                  optionsPosition={"top"}
                  options={createSelectOptions()}
                  svg={'horizontal'}
                  handleSelectChange={(e) => {
                    if (e.value === 'delete' && currentDict) {
                      dispatch(deleteDict(currentDict.id));
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default DictDetails;