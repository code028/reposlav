import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IUsers {
  id: string
  username: string
  email: string
  role: string
}

const initialState: IUsers = {
  id: '',
  username: '',
  email: '',
  role: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUsers>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    clearUser: (state) => {
      state.id = '';
      state.username = '';
      state.email = '';
      state.role = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
