import {createSlice, PayloadAction} from "@reduxjs/toolkit";


type InitialStateType = {
  textError: string,
  counterError: number,
  showError: boolean
}

const initialState: InitialStateType = {
  textError: "Непредвиденная ошибка",
  counterError: 0,
  showError: false
};

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setTextError(state, action: PayloadAction<string>) {
      state.textError = action.payload;
    },
    incrementCounterError(state, action: PayloadAction<null>) {
      state.counterError += 1;
    },
    setShowError(state, action: PayloadAction<boolean>) {
      state.showError = action.payload;
    }
  }
});
