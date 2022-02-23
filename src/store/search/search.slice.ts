import {createSlice, PayloadAction} from "@reduxjs/toolkit";


type InitialStateType = {
  date: {
    startDate: string | null,
    endDate: string | null
  }
}


const initialState: InitialStateType = {
  date: {
    startDate: null,
    endDate: null
  }
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<typeof initialState.date>) {
      state.date = action.payload;
    }
  }
});
