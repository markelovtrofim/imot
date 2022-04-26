import en from './en.json';
import ru from './ru.json';
import {LangType} from "../store/lang/lang.slice";

export const translate = (key: string, language: string): string => {
  let langData: { [key: string]: string } = {};
  if (language === 'en') {
    langData = en;
  } else if (language === 'ru') {
    langData = ru;
  }
  return langData[key];
}