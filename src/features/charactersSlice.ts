import { createSlice } from "@reduxjs/toolkit";
import type { Dispatch, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3005';

const charactersSlice = createSlice({
  name: 'characters',
  initialState: [],
  reducers: {
    setCharacters: (state, action) => {
      return action.payload;
    },
  },
})

export const { setCharacters } = charactersSlice.actions;

export function getAndSetCharacters() {
  return (dispatch: Dispatch) => {
    axios.get('/characters')
      .then(res => {
        dispatch(setCharacters(res.data));
      })
      .catch(error => {
        console.error('Failed to fetch characters:', error);
      });
  };
}

export default charactersSlice.reducer;
