import {createSlice, PayloadAction} from "@reduxjs/toolkit";


type InitialStateType = {
  date: Date[] | null
}


const initialState: InitialStateType = {
  date: null,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<Date[]>) {
      state.date = action.payload;
    }
  }
});
