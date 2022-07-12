import React, { Dispatch, FC, useState } from 'react';
import { IconButton, InputBase, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ModalWindow from "../../../../components/common/ModalWindowBox";
import { LoadingButton } from "@mui/lab";
import { translate } from "../../../../localizations";
import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import ContainedSelect from "../../../../components/common/Selects/ContainedSelect";
import { useAppSelector } from "../../../../hooks/redux";
import { RootState } from "../../../../store/store";
import { DirectionOptions, getTag, getTagGroups, getTags, postTag, tagsSlice } from "../../../../store/tags/tags.slice";
import Field from "../../../../components/common/FIeld";
import { useDispatch } from "react-redux";
import Snackbar, { SnackbarType } from "../../../../components/common/Snackbar";
import { dictsSlice, getDict, getDicts, getGroups } from "../../../../store/dicts/dicts.slice";
import { useHistory } from "react-router-dom";
import { searchStringParserInObj } from "../TagPage";


type PostModalWindowType = {
  isOpen: boolean,
  handleMWClose: () => void,
  setSnackbar: any
}

const PostModalWindow: FC<PostModalWindowType> = ({ isOpen, handleMWClose, setSnackbar }) => {
  const useStyles = makeStyles(({
    MWTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px'
    },
    MWTitleText: {
      fontWeight: '700 !important'
    },
    MWButtons: {
      marginTop: '15px',
      textAlign: 'right'
    },
    MWInput: {
      width: '100%',
      height: '20px',
      '&:input': {
        padding: '0'
      }
    },
    MWTextTitle: {
      cursor: 'default',
      color: '#738094 !important',
      fontWeight: '700 !important',
      fontSize: '13px !important',
      margin: '5px 0 !important'
    }
  }));

  const classes = useStyles();
  const { language } = useAppSelector((state: RootState) => state.lang);
  const allDicts = useAppSelector(state => state.tags.allGlobalFilterCriterias).find(item => item.key === 'client_text');
  const userId = useAppSelector(state => state.users.currentUser?.id);

  function dictsConverter() {
    if (allDicts) {
      const result: { value: string, label: string }[] = []
      for (let i = 0; i < allDicts.values.length; i++) {
        result.push({ label: allDicts.values[i], value: allDicts.values[i] });
      }
      return result;
    } else {
      return [];
    }
  }

  const convertedDicts = dictsConverter();

  const dispatch = useDispatch();

  // костыльный костыль
  const [render, setRender] = useState<string>('');
  const search = useAppSelector(state => state.tags.searchParams);
  const searchParamsObject = searchStringParserInObj(search);

  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      howSaid: DirectionOptions[0],
      dict: convertedDicts[0],
      group: ''
    },
    onSubmit: async () => {
      setLoading(true);
      const postTagData = await dispatch(postTag({
        owner: userId,
        title: formik.values.dict.value.slice(9),
        group: formik.values.group,
        rulePriority: 0,
        calculatedRulePriority: 0,
        enabled: true,
        globalFilter: [],
        fragmentRules: [{
          phrasesAndDicts: [],
          phrases: [],
          dicts: [],
          direction: formik.values.howSaid.value,
          fromStart: false,
          silentBefore: '',
          silentAfter: '',
          interruptTime: ''
        }],
        setTags: []
      }));
      // @ts-ignore
      const tagId = postTagData.payload;

      const groupsData = await dispatch(getTagGroups());
      // @ts-ignore
      const group = groupsData.payload.filter((item) => item.group === formik.values.group)[0];
      dispatch(tagsSlice.actions.setCurrentTagGroup(group))
      await dispatch(getTags({ group: formik.values.group }));
      await dispatch(getTag(tagId));

      handleMWClose();
      setLoading(false);

      setSnackbar({ type: 'success', value: true, time: 2000, text: 'Тег добавлен' });

      dispatch(tagsSlice.actions.setSearchParams(`?group=${group.group}&id=${tagId}`));
      history.location.pathname = `/`;
      history.replace(`${language}/${userId}/markuprules/tags?group=${group.group}&id=${tagId}`);
      dispatch(tagsSlice.actions.setSearchInput(""));
    }
  })
  return (
    <ModalWindow
      isMWOpen={isOpen} handleMWClose={handleMWClose}
      text={"Введите базовые данные тега"}
      width={'400px'}
    >
      <form onSubmit={formik.handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <Typography className={classes.MWTextTitle}>
            Кто сказал
          </Typography>
          <ContainedSelect
            width={'100%'}
            onSelectChange={(e: any) => {
              formik.values.howSaid = e;
              setRender(e.value);
            }}
            options={DirectionOptions}
            value={formik.values.howSaid}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Typography className={classes.MWTextTitle}>
            Название словаря
          </Typography>
          <ContainedSelect
            width={'100%'}
            onSelectChange={(e: any) => {
              formik.values.dict = e;
              setRender(e.value);
            }}
            options={convertedDicts}
            value={formik.values.dict}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Field
            margin={'0 0 15px 0'}
            label={"Название группы"}
            width={"100%"}
          >
            <InputBase
              name={"group"}
              type="text"
              value={formik.values.group}
              onChange={formik.handleChange}
            />
          </Field>
        </div>

        <div className={classes.MWButtons}>
          <LoadingButton
            loading={loading}
            style={{ marginRight: '15px' }}
            variant="contained"
            color="primary"
            type="submit"
          >
            {translate("sendButton", language)}
          </LoadingButton>
          <LoadingButton
            variant="contained"
            color="secondary"
            onClick={handleMWClose}
          >
            {translate("cancelButton", language)}
          </LoadingButton>
        </div>
      </form>

    </ModalWindow>
  );
};

export default PostModalWindow;