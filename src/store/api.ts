import axios from 'axios';

const API_URL = 'https://imot-api.pyzzle.ru';

export const instance = axios.create({
  baseURL: API_URL
});
