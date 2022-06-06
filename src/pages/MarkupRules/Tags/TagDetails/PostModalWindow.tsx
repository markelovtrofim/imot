import React, {FC, useState} from 'react';
import {IconButton, InputBase, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import ModalWindow from "../../../../components/common/ModalWindowBox";
import {LoadingButton} from "@mui/lab";
import {translate} from "../../../../localizations";
import {useFormik} from "formik";
import CloseIcon from "@mui/icons-material/Close";
import ContainedSelect from "../../../../components/common/Selects/ContainedSelect";
import {useAppSelector} from "../../../../hooks/redux";
import {RootState} from "../../../../store/store";
import {DirectionOptions, getTagGroups, postTag} from "../../../../store/tags/tags.slice";
import Field from "../../../../components/common/FIeld";
import {useDispatch} from "react-redux";


type PostModalWindowType = {
  isOpen: boolean,
  handleMWClose: () => void
}

const PostModalWindow: FC<PostModalWindowType> = ({isOpen, handleMWClose}) => {
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
  const {language} = useAppSelector((state: RootState) => state.lang);
  const allDicts = useAppSelector(state => state.tags.allGlobalFilterCriterias).find(item => item.key === 'client_text');
  const userId = useAppSelector(state => state.users.currentUser?.id);
  console.log(userId);
  function dictsConverter() {
    if (allDicts) {
      const result: { value: string, label: string }[] = []
      for (let i = 0; i < allDicts.values.length; i++) {
        result.push({label: allDicts.values[i], value: allDicts.values[i]});
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

  const formik = useFormik({
    initialValues: {
      howSaid: DirectionOptions[0],
      dict: convertedDicts[0],
      group: ''
    },
    onSubmit: async () => {
      await dispatch(postTag({
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
      await dispatch(getTagGroups());
      handleMWClose();
    }
  })
  console.log(formik.values);
  return (
    <ModalWindow
      isOpen={isOpen} handleClose={handleMWClose}
      width={'400px'}
    >
      <div className={classes.MWTitle}>
        <Typography className={classes.MWTitleText}>Введите базовые данные тега</Typography>
        <IconButton onClick={handleMWClose}>
          <CloseIcon style={{color: '#000000', width: '15px', height: '15px'}}/>
        </IconButton>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div style={{marginBottom: '20px'}}>
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
        <div style={{marginBottom: '20px'}}>
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
        <div style={{marginBottom: '20px'}}>
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
            loading={false}
            style={{marginRight: '15px'}}
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