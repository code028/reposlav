import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

const initialState: ITokens = {
  accessToken: '',
  refreshToken: '',
};

export const sessionReducer = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setTokens: (state: ITokens, action: PayloadAction<ITokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearTokens: (state) => {
      state.accessToken = '';
      state.refreshToken = '';
    },
  },
});

export const { setTokens, clearTokens } = sessionReducer.actions;

export default sessionReducer.reducer;